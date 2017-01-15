"use strict";

const {
  ipcRenderer
} = require('electron');
const fs = require('fs-extra');

let guiConfig = {};

// close the App
guiConfig.close = function () {
  ipcRenderer.send('closeApp');
};

// quit hard
guiConfig.destroy = function () {
  ipcRenderer.send('destroyApp');
};

// minimize the App
guiConfig.minimize = function () {
  ipcRenderer.send('minimizeApp');
};

// maximize the App
guiConfig.maximize = function () {
  ipcRenderer.send('maximizeApp');
};

guiConfig.logOut = function () {
  fs.removeSync(`${__dirname}/userConfig.json`);
  this.destroy();
};

module.exports = {
  guiConfig: guiConfig
}