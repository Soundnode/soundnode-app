"use strict";

var gui = window.require('nw.gui');
var userConfig = {};

userConfig.checkAuth = function() {

    if( ! window.localStorage.SC ) {
        console.log('User not saved');
        return false;
    }

    console.log('User is saved');

    // Make Information Readable
    window.SC = window.localStorage.SC;
    window.scAccessToken = window.localStorage.scAccessToken;
    window.scClientId = window.localStorage.scClientId;

    // Bring Soundnode to focus
    window.focus();

    return true;
};

userConfig.saveUser = function() {
    console.log('Saving user to localStorage');
    // Save all to localStorage
    window.localStorage.SC = window.SC;
    window.localStorage.scAccessToken = window.SC.accessToken();
    window.localStorage.scClientId = window.SC.options.client_id;

    console.dir('window.localStorage.SC', window.localStorage.SC)
};

userConfig.windowState = function() {
    if(window.localStorage.width || window.localStorage.height) {
        gui.Window.get().width = Math.round(window.localStorage.width);
        gui.Window.get().height = Math.round(window.localStorage.height);
    }

    gui.Window.get().on('resize', function(width, height) {
        userConfig.saveWindow(width, height);
    });
};

userConfig.saveWindow = function(width, height) {
    if(width || height) {
        window.localStorage.width = Math.round(width);
        window.localStorage.height = Math.round(height);
    }
};

userConfig.scaleWindow = function(scaleValue){
    window.localStorage.scale = scaleValue;
    window.document.getElementsByTagName("body")[0].style.zoom = window.localStorage.scale
};

userConfig.scaleInit = function() {
    if ( ! window.localStorage.scale ) {
        window.localStorage.setItem('scale', 1);
        window.document.getElementsByTagName("body")[0].style.zoom = window.localStorage.scale;
    }
};
