"use strict";

const {
  ipcRenderer
} = require('electron');
const fs = require('fs-extra');
const userHome = require('user-home');

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
  let _userConfigPath = `${__dirname}/app/public/js/system/userConfig.json`; // Windows specific for now

  /** Linux platforms - XDG Standard */
  if (process.platform === 'linux') {
    _userConfigPath = `${userHome}/.config/Soundnode/userConfig.json`;
  }

  /** Mac os configuration location */
  if (process.platform === 'darwin') {
    _userConfigPath = `${userHome}/Library/Preferences/Soundnode/userConfig.json`;
  }

  fs.removeSync(`${_userConfigPath}`);
  this.destroy();
};

module.exports = {
  guiConfig: guiConfig
}