"use strict";

var gui = require('nw.gui');
var guiConfig = {};


// Store the GUI window
guiConfig.getGUI = gui.Window.get();

guiConfig.init = function () {
    this.navBarUserUnAuthenticated();
};

// close the App
guiConfig.close = function () {
    if (process.platform !== "darwin") {
        this.getGUI.close(true);
    }
    else {
        this.getGUI.hide();
    }
};

// minimize the App
guiConfig.minimize = function () {
    this.getGUI.minimize();
};

// maximize the App
guiConfig.maximize = function () {
    if (this.getGUI.isMaximized) {
        this.getGUI.unmaximize();
        this.getGUI.isMaximized = false;
    } else {
        this.getGUI.maximize();
        this.getGUI.isMaximized = true;
    }
};

// reopen the App, this is OS X specific
gui.App.on('reopen', function() {
    guiConfig.getGUI.show();
});

// open dev tools
guiConfig.openDevTools = function () {
    guiConfig.getGUI.showDevTools();
};

// when main window is closed, kill other windows (prevent running nw.js with invisible windows on crash etc.)

guiConfig.getGUI.on('close', function () {
    gui.App.closeAllWindows();
    this.close(true);
});


/**
 * Set GUI nav
 * @method navBarUserUnAuthenticated
 */
guiConfig.navBarUserUnAuthenticated = function() {
    if (process.platform !== "darwin") {
        return false;
    }

    var nativeMenuBar = new gui.Menu({ type: "menubar" });
    var help = new gui.Menu();

    nativeMenuBar.createMacBuiltin("Soundnode", {
        hideEdit: false,
        hideWindow: false
    });

    // Help Menu
    nativeMenuBar.append(
        new gui.MenuItem({
            label: 'Help',
            submenu: help
        })
    );

    // DevTools
    help.append(
        new gui.MenuItem({
            label: 'Developer Tools',
            click: function() {
                guiConfig.openDevTools();
            }
        })
    );

    this.getGUI.menu = nativeMenuBar;
};

guiConfig.navBarUserAuthenticated = function() {
    if (process.platform !== "darwin") {
        return false;
    }

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
        hideEdit: false,
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
                guiConfig.close();
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
                gui.Shell.openExternal('https://github.com/Soundnode/soundnode-app/wiki/Help');
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
                guiConfig.openDevTools();
            }
        })
    );

    guiConfig.getGUI.menu = nativeMenuBar;

};