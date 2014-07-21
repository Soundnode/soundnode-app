var gui = require('nw.gui')
    , uiFrame = {}
    , OAuthVerification = {}
    , appGUI = {};

// Iframe hosting the OAuth
var elemIframe = document.getElementById('elIframe');

/**
 * Responsible to add GUI events
 */

// Store the GUI window
// appGUI.getGUI = gui.Window.get();

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

appGUI.openDevTools();

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

    elemIframe.onload = function() {
        OAuthVerification = window.setInterval( that.verification, 1500);
    }
}

OAuthVerification.verification = function() {
    var iframeDocument = elemIframe.contentDocument
        , elIframeBody = iframeDocument.body
        , isOAuthDone = elIframeBody.getAttribute('data-isOAuth-done');

    console.log('verification called');

    if (isOAuthDone === 'true') {
        // Expose Soundcloud API to node-webkit object window
        window.SC = elemIframe.contentWindow.SC;
        window.scAccessToken = window.SC.accessToken();
        window.scClientId = window.SC.options.client_id;
        // stop verification
        window.clearInterval(OAuthVerification);

        // Start the App
        angular.bootstrap(document, ['App']);
        document.body.setAttribute('data-isVisible', 'true');

        console.log('verification done')
    }
}

// Initialize all
uiFrame.init();
OAuthVerification.init();
