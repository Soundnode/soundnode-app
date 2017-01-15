"use strict";

const ua = require('universal-analytics');
const fs = require('fs');
const userConfig = JSON.parse(fs.readFileSync(`${__dirname}/userConfig.json`, 'utf-8'));

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