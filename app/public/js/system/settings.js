"use strict";

const ua = require('universal-analytics');
const configuration = require('../common/configLocation');
const userConfig = configuration.getConfigfile();

// Set up some core settings
window.settings = {};

// App version
window.settings.appVersion = '7.0.0';

// GA >> DO NOT CHANGE OR USE THIS CODE <<
window.settings.visitor = ua('UA-67310953-1');

// set window access token
window.scAccessToken = userConfig.accessToken;

// set window clientId
window.scClientId = userConfig.clientId;
