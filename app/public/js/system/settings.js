"use strict";

var ua = require('universal-analytics');

// Set up some core settings
window.settings = {};

// App version
window.settings.appVersion = '0.6.5';

// GA >> DO NOT CHANGE OR USE THIS CODE <<
window.settings.visitor = ua('UA-67310953-1');

// Simple function to check whether OS supports minimize to tray option
window.settings.traySupport = function () {
    //List of supported OS for minimize for tray option
    var os = {
        "win32": true,
        "linux32": false,
        "linux64": false,
        "darwin": false
    };

    return os[process.platform] || false;
};
