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

userConfig.scaleWindow = function(scale){
    if("plus" === scale) {
        var currentScale = window.document.getElementsByTagName("body")[0].style.zoom;
        var newScale = (currentScale * 100 + 10);

        window.document.getElementsByTagName("body")[0].style.zoom = newScale / 100;

        userConfig.saveScale(window.document.getElementsByTagName("body")[0].style.zoom);
    }
    if("minus" === scale) {
        var currentScale = window.document.getElementsByTagName("body")[0].style.zoom;
        var newScale = newScale = (currentScale - .1);

        window.document.getElementsByTagName("body")[0].style.zoom = newScale;

        userConfig.saveScale(window.document.getElementsByTagName("body")[0].style.zoom);
    }
    if("reset" === scale) {
        window.document.getElementsByTagName("body")[0].style.zoom = 1;

        userConfig.saveScale(window.document.getElementsByTagName("body")[0].style.zoom);
    }
};

userConfig.saveScale = function(scale) {
    window.localStorage.scale = scale;
};

userConfig.scaleState = function() {
    if(window.localStorage.scale) {
        window.document.getElementsByTagName("body")[0].style.zoom = window.localStorage.scale;
    }
};
