"use strict";

const {
  ipcRenderer
} = require('electron');

let userConfig = {};

userConfig.checkAuth = function () {

  if (!window.localStorage.SC) {
    console.log('User not saved');
    return false;
  }

  console.log('User is saved');

  let lastPlayedSongDuration = +window.localStorage.lastPlayedSongDuration || 0;
  let queueCurrentPosition = +window.localStorage.queueCurrentPosition;

  // Expose some globals to the window
  window.SC = window.localStorage.SC;
  window.scAccessToken = window.localStorage.scAccessToken;
  window.scClientId = window.localStorage.scClientId;

  // Bring Soundnode to focus
  window.focus();

  return true;
};

userConfig.saveUser = function () {
  console.log('Saving user to localStorage');
  // Save all to localStorage
  window.localStorage.SC = window.SC;
  window.localStorage.scAccessToken = window.SC.accessToken();
  window.localStorage.scClientId = window.SC.options.client_id;
};

userConfig.windowState = function () {
  let width, height;

  if (window.localStorage.width && window.localStorage.height) {
    width = Math.round(window.localStorage.width);
    height = Math.round(window.localStorage.height);

    ipcRenderer.send('resizeApp', width, height);
  }

  // userConfig.saveWindowSize(width, height);
  window.addEventListener('resize', () => {
    userConfig.saveWindowSize(
      ipcRenderer.send('getSize').width,
      ipcRenderer.send('getSize').height
    );
  }, false);
};

userConfig.saveWindow = function (width, height) {
  if (width || height) {
    window.localStorage.width = Math.round(width);
    window.localStorage.height = Math.round(height);
  }
};

userConfig.scaleWindow = function (scaleValue) {
  window.localStorage.scale = scaleValue;
  window.document.getElementsByTagName("body")[0].style.zoom = window.localStorage.scale
};

userConfig.scaleInit = function () {
  if (!window.localStorage.scale) {
    window.localStorage.setItem('scale', 1);
  }
  window.document.getElementsByTagName("body")[0].style.zoom = window.localStorage.scale;
};

module.exports = {
  userConfig: userConfig
}