var gui = require('nw.gui')
    , uiFrame = {}
    , OAuthVerification = {}
    , OAuthVerificationId
    , appGUI = {}
    , appSystem = {};

// Iframe hosting the OAuth
var elemIframe = document.getElementById('elIframe');

/**
 * Responsible to add GUI events
 */

// Store the GUI window
appGUI.getGUI = gui.Window.get();

// close the App
appGUI.close = function() {
  var guiWin = this.getGUI;
  guiWin.close(true);
}

// minimize the App
appGUI.minimize = function() {
  var guiWin = this.getGUI;
  guiWin.minimize();
}

// maximize the App
appGUI.maximize = function() {
  var guiWin = this.getGUI;
  guiWin.maximize();
}

// open dev tools
appGUI.openDevTools = function() {
    var guiWin = gui.Window.get();
    guiWin.showDevTools();
}

//appGUI.openDevTools();

/**
 * Responsible to enable all UI frame actions
 */
uiFrame.init = function() {
    // this.OpenDevTools();
    this.addGUIeventHandlers();
}

uiFrame.addGUIeventHandlers = function() {
    // Get the current window
    var elCloseApp = document.getElementById('closeApp')
        , elMinimizeApp = document.getElementById('minimizeApp')
        , elExpandApp = document.getElementById('expandApp');

    // Close App
    $(elCloseApp).on('click', function() {
        appGUI.close();
    });

    // Minimize App
    $(elMinimizeApp).on('click', function() {
        appGUI.minimize();
    });

    // Expand App
    $(elExpandApp).on('click', function() {
        appGUI.maximize();
    });

}

/**
 * Responsible to verify if user was verified
 */
OAuthVerification.init = function() {
    var that = this;
    var popUp = window.open('http://sc-redirect.herokuapp.com/', '_blank', 'screenX=0,screenY=0,width=100,height=100');

    OAuthVerificationId = window.setInterval(function() {
        that.verification(popUp);
    }, 1500);
}

OAuthVerification.verification = function(popUp) {
    var isOAuthDone;

    if ( popUp.document.body !== null ) {
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
}

/**
 * Responsible to system events
 */
appSystem.saveSong = function(songTitle, songUrl, folderPath) {
    var url = songUrl + '?client_id=' + window.scClientId + + '&oauth_token=' + window.scAccessToken
        , path = '.' + folderPath + '/' + songTitle;
}

// Initialize all
uiFrame.init();
OAuthVerification.init();