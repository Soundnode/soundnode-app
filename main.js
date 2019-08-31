"use strict";

const fs = require('fs-extra');
const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  Menu
} = require('electron');
const windowStateKeeper = require('electron-window-state');
const configuration = require('./app/public/js/common/configLocation');

// custom constants
const clientId = '342b8a7af638944906dcdb46f9d56d98';
const redirectUri = 'http://sc-redirect.herokuapp.com/callback.html';
const SCconnect = `https://soundcloud.com/connect?&client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token`;

let mainWindow;
let authenticationWindow;

app.on('ready', () => {
  checkUserConfig();
});

function checkUserConfig() {
  const containsConfig = configuration.containsConfig();

  if (containsConfig) {
    initMainWindow();
  } else {
    authenticateUser();
  }
}

/**
 * User config file doesn't exists
 * therefore open soundcloud authentication page
 */
function authenticateUser() {
  let contents;

  authenticationWindow = new BrowserWindow({
    width: 600,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false
    }
  });
  authenticationWindow.loadURL(SCconnect);
  authenticationWindow.show();

  contents = authenticationWindow.webContents;

  contents.on('did-navigate', (_event, url, httpResponseCode) => {
    const access_tokenStr = 'access_token=';
    const expires_inStr = '&expires_in';
    let accessToken;

    if (url.indexOf('access_token=') < 0) {
      return false;
    }

    accessToken = url.substring(url.indexOf(access_tokenStr) + 13, url.indexOf(expires_inStr));

    accessToken = accessToken.split('&scope=')[0];

    setUserData(accessToken);
    authenticationWindow.destroy();
  });
}

function setUserData(accessToken) {
  fs.writeFileSync(configuration.getPath(), JSON.stringify({
    accessToken: accessToken,
    clientId: clientId
  }), 'utf-8');

  initMainWindow();
}

function initMainWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1180,
    defaultHeight: 755
  });

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 800,
    minHeight: 640,
    center: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(`file://${__dirname}/app/index.html`);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.on('will-navigate', function (e, url) {
    if (url.indexOf('build/index.html#') < 0) {
      e.preventDefault();
    }
  });

  mainWindow.webContents.on('did-finish-load', function () {
    mainWindow.setTitle('Soundnode');
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindowState.manage(mainWindow);
  initializeMediaShortcuts();
  menuBar();
}

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

app.on('activate', () => {
  showAndFocus();
});

/**
 * Receive maximize event and trigger command
 */
ipcMain.on('maximizeApp', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

/**
 * Receive minimize event and trigger command
 */
ipcMain.on('minimizeApp', () => {
  mainWindow.minimize()
});

/**
 * Receive hide event and trigger command
 */
ipcMain.on('hideApp', () => {
  mainWindow.hide();
});

ipcMain.on('showApp', () => {
  showAndFocus();
});

/**
 * Receive close event and trigger command
 */
ipcMain.on('closeApp', () => {
  if (process.platform !== "darwin") {
    mainWindow.destroy();
  } else {
    mainWindow.hide();
  }
});

//
ipcMain.on('destroyApp', () => {
  mainWindow.close();
});

function showAndFocus() {
  mainWindow.show();
  mainWindow.focus();
}

function initializeMediaShortcuts() {
  globalShortcut.register('MediaPlayPause', () => {
    mainWindow.webContents.send('MediaPlayPause');
  });

  globalShortcut.register('MediaStop', () => {
    mainWindow.webContents.send('MediaStop');
  });

  globalShortcut.register('MediaPreviousTrack', () => {
    mainWindow.webContents.send('MediaPreviousTrack');
  });

  globalShortcut.register('MediaNextTrack', () => {
    mainWindow.webContents.send('MediaNextTrack');
  });
}

function menuBar() {
  const template = [
    {
      role: 'editMenu',
      label: 'Soundnode'
    },
    {
      role: 'view',
      label: 'View',
      submenu: [
        {
          role: 'togglefullscreen'
        },
        {
          role: 'close'
        },
        {
          type: 'separator'
        },
        {
          label: 'Learn More',
          click() {
            require('electron').shell.openExternal('https://github.com/Soundnode/soundnode-app/wiki/Help')
          }
        },
        {
          label: 'License',
          click() {
            require('electron').shell.openExternal('https://github.com/Soundnode/soundnode-app/blob/master/LICENSE.md')
          }
        }
      ]
    },
    {
      role: 'windowMenu',
      submenu: [
        {
          role: 'quit'
        },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.reload()
            }
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click(item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.webContents.toggleDevTools()
            }
          }
        },
        {
          type: 'separator'
        },
        {
          role: 'resetzoom'
        },
        {
          role: 'zoomin'
        },
        {
          role: 'zoomout'
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu)
}
