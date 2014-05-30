var gui = require('nw.gui')
    , uiFrame = {}
    , OAuthVerification = {};

// Iframe hosting the OAuth
var elemIframe = document.getElementById('elIframe');

/**
 * Responsible to enable all UI frame actions
 */
uiFrame.init = function() {
    this.OpenDevTools();
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
        document.body.setAttribute('data-isVisible', 'true');
        angular.bootstrap(document, ['App']);

        console.log('verification done')
    }
}

// Initialize all
uiFrame.init();
OAuthVerification.init();

/**
 * API SOUNDCLOUD ENDPOINTS
 * https://developers.soundcloud.com/docs/api/reference#me
 */

// GET /users/{id} a user
// GET /users/{id}/tracks  list of tracks of the user
// GET /users/{id}/playlists   list of playlists (sets) of the user
// GET /users/{id}/followings  list of users who are followed by the user
// GET, PUT, DELETE    /users/{id}/followings/{id} a user who is followed by the user
// GET /users/{id}/followers   list of users who are following the user
// GET /users/{id}/followers/{id}  user who is following the user
// GET /users/{id}/comments    list of comments from this user
// GET /users/{id}/favorites   list of tracks favorited by the user
// GET, PUT, DELETE    /users/{id}/favorites/{id}  track favorited by the user
// GET /users/{id}/groups  list of joined groups
// GET, PUT, DELETE    /users/{id}/web-profiles    list of web profiles
// GET /me/{id}/activities list dashboard activities
// GET, POST   /me/{id}/connections    list of connected external profiles