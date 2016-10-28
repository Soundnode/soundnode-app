"use strict";

let userConfig = {};

userConfig.checkAuth = function () {

  if (!window.localStorage.SC) {
    console.log('User not cached');
    return false;
  }

  console.log('User cached');

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

module.exports = {
  userConfig: userConfig
}