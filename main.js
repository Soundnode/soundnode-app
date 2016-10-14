"use strict";

const {
  app,
  BrowserWindow
} = require('electron');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 755,
    frame: false
  });

  mainWindow.loadURL(`file://${__dirname}/app/index.html`);
});