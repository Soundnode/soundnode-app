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

appSystem.AppMenu = function (type) {
    if (process.platform !== "darwin") {
        return false;
    }

    // Optimize Loading by putting the least amount of code first.
    if( !type ) {
        var nativeMenuBar = new gui.Menu({ type: "menubar" });

        // OS X Menu
        nativeMenuBar = new gui.Menu({ type: "menubar" });

        nativeMenuBar.createMacBuiltin("Soundnode", {
            hideEdit: true,
            hideWindow: false
        });

        appGUI.getGUI.menu = nativeMenuBar;

    } else {
        var nativeMenuBar = new gui.Menu({ type: "menubar" }),
            file = new gui.Menu(),
            playback = new gui.Menu(),
            help = new gui.Menu(),
            playerElement = document.querySelector('[ng-controller=PlayerCtrl]'),
            playerScope = angular.element(playerElement).scope();

        // For Volume
        player.elPlayer = document.getElementById('player');

        // OS X Menu
        nativeMenuBar = new gui.Menu({ type: "menubar" });

        nativeMenuBar.createMacBuiltin("Soundnode", {
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
                    SC.disconnect();
                    appGUI.close();
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

        // Play/Pause
        playback.append(
            new gui.MenuItem({
                label: 'Play',
                click: function() {
                    if(this.label === "Play") {
                        playerScope.playPause();
                        this.label = "Pause";
                    } else {
                        playerScope.playPause();
                        this.label = "Play";
                    }
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
                    playerScope.nextSong();
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
                    playerScope.prevSong();
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

        //TODO: improve/finish the piece of code commented out below

        //// Shuffle
        //playback.append(
        //    new gui.MenuItem({
        //        label: 'Shuffle',
        //        click: function() {
        //            console.log("Shuffle Songs");
        //        },
        //        key: "s",
        //        modifiers: "cmd"
        //    })
        //);
        //
        //// Repeat
        //playback.append(
        //    new gui.MenuItem({
        //        label: 'Repeat',
        //        click: function() {
        //            console.log("Repeat Song");
        //        },
        //        key: "r",
        //        modifiers: "cmd"
        //    })
        //);
        //
        //// Seperator
        //playback.append(
        //    new gui.MenuItem({
        //        type: 'separator'
        //    })
        //);
        //
        //// Volume Up
        //playback.append(
        //    new gui.MenuItem({
        //        label: 'Volume Up',
        //        click: function() {
        //            console.log('volume up', player.elPlayer.volume)
        //            playerService.volume(playerService.volume() - 0.1);
        //            $scope.volume = playerService.volume();
        //        },
        //        key: String.fromCharCode(30),
        //        modifiers: "cmd"
        //    })
        //);
        //
        //// Volume Down
        //playback.append(
        //    new gui.MenuItem({
        //        label: 'Volume Down',
        //        click: function() {
        //            console.log('volume down', player.elPlayer.volume)
        //            playerService.volume(playerService.volume() - 0.1);
        //            $scope.volume = playerService.volume();
        //        },
        //        key: String.fromCharCode(31),
        //        modifiers: "cmd"
        //    })
        //);

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

        // Seperator
        help.append (
            new gui.MenuItem({
                type: 'separator'
            })
        );

        // DevTools
        help.append(
            new gui.MenuItem({
                label: 'Developer Tools',
                click: function() {
                    appGUI.openDevTools();
                }
            })
        );

        appGUI.getGUI.menu = nativeMenuBar;
    }

};


/**
 * Responsible to verify if user was verified
 */
OAuthVerification.init = function () {
    var that = this,
        popUp = window.open('http://sc-redirect.herokuapp.com/', '_blank', 'screenX=0,screenY=0,width=50,height=50');

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
        appSystem.AppMenu(true);
    } else {
        appSystem.AppMenu(false);
    }
};

/**
 * Responsible to system events
 */
// appSystem.saveSong = function (songTitle, songUrl, folderPath) {
//     var url = songUrl + '?client_id=' + window.scClientId + '&oauth_token=' + window.scAccessToken,
//         path = '.' + folderPath + '/' + songTitle;
// };



// Initialize all
uiFrame.init();
OAuthVerification.init();
