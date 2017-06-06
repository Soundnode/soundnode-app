"use strict";

const ua = require('universal-analytics');
const fs = require('fs');
const userHome = require('user-home');

let _userConfigPath = `${__dirname}/app/public/js/system/userConfig.json`; // Windows specific for now
/** Linux platforms - XDG Standard */
if (process.platform === 'linux') {
    _userConfigPath = `${userHome}/.config/Soundnode/userConfig.json`;
}

/** Mac os configuration location */
if (process.platform === 'darwin') {
    _userConfigPath = `${userHome}/Library/Preferences/Soundnode/userConfig.json`;
}
const userConfig = JSON.parse(fs.readFileSync(`${_userConfigPath}`, 'utf-8'));

// Set up some core settings
window.settings = {};

// App version
window.settings.appVersion = '0.6.5';

// GA >> DO NOT CHANGE OR USE THIS CODE <<
window.settings.visitor = ua('UA-67310953-1');

// set window access token
window.scAccessToken = userConfig.accessToken;

// set window clientId
window.scClientId = userConfig.clientId;