"use strict";

var gui = require('nw.gui'),
    uiFrame = {},
    OAuthVerification = {},
    OAuthVerificationId,
    appGUI = {},
    appSystem = {};

// Iframe hosting the OAuth
var elemIframe = document.getElementById('elIframe');

/**
 * Responsible to add GUI events
 */

// Store the GUI window
appGUI.getGUI = gui.Window.get();

// close the App
appGUI.close = function () {
    var guiWin = this.getGUI;
    guiWin.close(true);
};

// minimize the App
appGUI.minimize = function () {
    var guiWin = this.getGUI;
    guiWin.minimize();
};

// maximize the App
appGUI.maximize = function () {
    var guiWin = this.getGUI;
    guiWin.maximize();
};

// open dev tools
appGUI.openDevTools = function () {
    var guiWin = gui.Window.get();
    guiWin.showDevTools();
};

//appGUI.openDevTools();

/**
 * Responsible to enable all UI frame actions
 */
uiFrame.init = function () {
    // this.OpenDevTools();
    this.addGUIeventHandlers();
};

uiFrame.addGUIeventHandlers = function () {
    // Get the current window
    var elCloseApp = document.getElementById('closeApp'),
        elMinimizeApp = document.getElementById('minimizeApp'),
        elExpandApp = document.getElementById('expandApp');

    // Close App
    $(elCloseApp).on('click', function () {
        appGUI.close();
    });

    // Minimize App
    $(elMinimizeApp).on('click', function () {
        appGUI.minimize();
    });

    // Expand App
    $(elExpandApp).on('click', function () {
        appGUI.maximize();
    });

};

/**
 * Responsible to verify if user was verified
 */
OAuthVerification.init = function () {
    var that = this,
        popUp = window.open('http://sc-redirect.herokuapp.com/', '_blank', 'screenX=0,screenY=0,width=100,height=100');

    OAuthVerificationId = window.setInterval(function () {
        that.verification(popUp);
    }, 1500);
};

OAuthVerification.verification = function (popUp) {
    var isOAuthDone;

    if (popUp.document.body !== null) {
        isOAuthDone = popUp.document.body.getAttribute('data-isOAuth-done');
    } else {
        return;
    }

    console.log('verification called');

    if (isOAuthDone === 'true') {
        // Expose Soundcloud API to node-webkit object window
        window.SC = popUp.SC;
        window.scAccessToken = popUp.SC.accessToken();
        window.scClientId = popUp.SC.options.client_id;

        // close popUp
        popUp.close();
        // stop verification
        window.clearInterval(OAuthVerificationId);

        // Start the App
        angular.bootstrap(document, ['App']);
        document.body.setAttribute('data-isVisible', 'true');

        console.log('verification done');
    }
};

/**
 * Responsible to system events
 */
// appSystem.saveSong = function (songTitle, songUrl, folderPath) {
//     var url = songUrl + '?client_id=' + window.scClientId + '&oauth_token=' + window.scAccessToken,
//         path = '.' + folderPath + '/' + songTitle;
// };


appSystem.AppMenu = function () {
    if (process.platform === "darwin") {
        var nativeMenuBar = new gui.Menu({ type: "menubar" }),
            file = new gui.Menu(),
            playback = new gui.Menu(),
            help = new gui.Menu();


        // OS X Menu
        nativeMenuBar = new gui.Menu({ type: "menubar" });

        nativeMenuBar.createMacBuiltin("Soundnode-App", {
            hideEdit: true,
            hideWindow: false
        });

        // File Menu
        nativeMenuBar.insert(
            new gui.MenuItem({
                    label: 'File',
                    submenu: file
                }), 1
        );

        // New Playlist
        file.append(
            new gui.MenuItem({
                label: 'New Playlist',
                click: function() {
                    console.log("New Playlist");
                },
                key: "n",
                modifiers: "cmd"
            })
        );

        // Seperator
        file.append (
            new gui.MenuItem({
                type: 'separator'
            })
        );

        // Logout
        file.append(
            new gui.MenuItem({
                label: 'Logout',
                click: function() {
                    console.log("Logout");
                },
                key: "w",
                modifiers: "cmd+shift"
            })
        );

        // Playback Menu
        nativeMenuBar.append(
            new gui.MenuItem({
                label: 'Playback',
                submenu: playback
            })
        );

        // Pause
        playback.append(
            new gui.MenuItem({
                label: 'Pause',
                click: function() {
                    console.log("pause event");
                }
            })
        );

        // Seperator
        playback.append(
            new gui.MenuItem({
                type: 'separator'
            })
        );

        // Next
        playback.append(
            new gui.MenuItem({
                label: 'Next',
                click: function() {
                    console.log("Next Song");
                },
                key: String.fromCharCode(29),
                modifiers: "cmd"
            })
        );

        // Previous
        playback.append(
            new gui.MenuItem({
                label: 'Previous',
                click: function() {
                    console.log("Previous Song");
                },
                key: String.fromCharCode(28),
                modifiers: "cmd"
            })
        );

        // Seperator
        playback.append(
            new gui.MenuItem({
                type: 'separator'
            })
        );

        // Shuffle
        playback.append(
            new gui.MenuItem({
                label: 'Shuffle',
                click: function() {
                    console.log("Shuffle Songs");
                },
                key: "s",
                modifiers: "cmd"
            })
        );

        // Repeat
        playback.append(
            new gui.MenuItem({
                label: 'Repeat',
                click: function() {
                    console.log("Repeat Song");
                },
                key: "r",
                modifiers: "cmd"
            })
        );

        // Seperator
        playback.append(
            new gui.MenuItem({
                type: 'separator'
            })
        );

        // Volume Up
        playback.append(
            new gui.MenuItem({
                label: 'Volume Up',
                click: function() {
                    console.log("Volume Up");
                },
                key: String.fromCharCode(30),
                modifiers: "cmd"
            })
        );

        // Volume Down
        playback.append(
            new gui.MenuItem({
                label: 'Volume Up',
                click: function() {
                    console.log("Volume Down");
                },
                key: String.fromCharCode(31),
                modifiers: "cmd"
            })
        );

        // Help Menu
        nativeMenuBar.append(
            new gui.MenuItem({
                label: 'Help',
                submenu: help
            })
        );

        // Soundnode Help
        help.append(
            new gui.MenuItem({
                label: 'Soundnode Help',
                click: function() {
                    gui.Shell.openExternal('https://github.com/Soundnode/soundnode-app');
                }
            })
        );

        // Seperator
        help.append (
            new gui.MenuItem({
                type: 'separator'
            })
        );

        // Licenses
        help.append(
            new gui.MenuItem({
                label: 'Licenses',
                click: function() {
                    gui.Shell.openExternal('https://github.com/Soundnode/soundnode-app');
                }
            })
        );

        appGUI.getGUI.menu = nativeMenuBar;
    }
};

// Initialize all
uiFrame.init();
OAuthVerification.init();
appSystem.AppMenu();
