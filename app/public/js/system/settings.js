"use strict";

var ua = require('universal-analytics');

// Set up some core settings
window.settings = {};

// App version
window.settings.appVersion = '0.6.1';

// GA >> DO NOT CHANGE OR USE THIS CODE <<
window.settings.visitor = ua('UA-67310953-1');