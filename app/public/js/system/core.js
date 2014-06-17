var gui = require('nw.gui')
    , uiFrame = {}
    , OAuthVerification = {};

// Iframe hosting the OAuth
var elemIframe = document.getElementById('elIframe');

/**
 * Responsible to enable all UI frame actions
 */
uiFrame.init = function() {
    // this.OpenDevTools();
    this.addGUIeventHandlers();
}

uiFrame.OpenDevTools = function() {
    var guiWin = gui.Window.get();
    guiWin.showDevTools();
}

uiFrame.addGUIeventHandlers = function() {
    // Get the current window
    var guiWin = gui.Window.get()
        , elCloseApp = document.getElementById('closeApp')
        , elMinimizeApp = document.getElementById('minimizeApp')
        , elExpandApp = document.getElementById('expandApp');

    // Close App
    $(elCloseApp).on('click', function() {
        guiWin.close(true);
    });

    // Minimize App
    $(elMinimizeApp).on('click', function() {
        guiWin.minimize();
    });

    // Expand App
    $(elExpandApp).on('click', function() {
        guiWin.maximize()
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
