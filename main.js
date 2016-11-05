"use strict";

const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  Menu
} = require('electron');
const windowStateKeeper = require('electron-window-state');

let mainWindow;

app.on('ready', () => {
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
    frame: false
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
});

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
    app.quit();
  } else {
    mainWindow.hide();
  }
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
      role: 'view',
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
      role: 'window',
      submenu: [
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