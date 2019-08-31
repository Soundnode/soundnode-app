"use strict";

const ua = require('universal-analytics');
const configuration = require('../common/configLocation');
const userConfig = configuration.getConfigfile();
const fs = require('fs-extra');

// Set up some core settings
window.settings = {};

// App version
window.settings.appVersion = '7.0.0';

// GA >> DO NOT CHANGE OR USE THIS CODE <<
window.settings.visitor = ua('UA-67310953-1');

// set window access token
window.scAccessToken = userConfig.accessToken;

// Set window social settings
window.socialSettings = userConfig.socialSettings;

// set window clientId
window.localStorage.setItem('scClientId', userConfig.clientId);

window.settings.updateUserConfig = function () {
    fs.writeFileSync(configuration.getPath(), JSON.stringify({
        accessToken: userConfig.accessToken,
        clientId: window.localStorage.scClientId,
        socialSettings: userConfig.socialSettings || false,
    }), 'utf-8');
}

window.settings.setSocialSettings = (socialSettings) => {
    fs.writeFileSync(configuration.getPath(), JSON.stringify({
        accessToken: userConfig.accessToken,
        clientId: window.localStorage.scClientId,
        socialSettings: socialSettings || false,
    }), 'utf-8');
};
