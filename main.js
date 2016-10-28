"use strict";

const {
  app,
  BrowserWindow,
  ipcMain
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
});

app.on('activate', () => {
  mainWindow.show();
  mainWindow.focus();
})

/**
 * Resize app window based on received optons
 */
ipcMain.on('resizeApp', (e, width, height) => {

});

/**
 * Receive maximize event and trigger command
 */
ipcMain.on('maximizeApp', () => {
  mainWindow.maximize();
});

/**
 * Receive minimize event and trigger command
 */
ipcMain.on('minimizeApp', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

/**
 * Receive hide event and trigger command
 */
ipcMain.on('hideApp', () => {
  mainWindow.hide();
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

ipcMain.on('getSize', (e) => {
  e.returnValue = getSize();
});

/**
 * Get app size and return width and height in an obj
 */
function getSize() {
  let appSize = mainWindow.getSize();

  return {
    width: appSize[0],
    height: appSize[1]
  }
}