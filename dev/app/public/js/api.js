// GUI setup
var gui = require('nw.gui');

// open devtools
gui.Window.get().showDevTools();

/**
 * Expose Soundcloud API
 */
var exposeSoundCloudAPI = (function () {
    var elIframe = document.getElementById('elIframe');

    var verification = function () {
        var iframeDocument = elIframe.contentDocument
            , elIframeBody = iframeDocument.body
            , isOAuthDone = elIframeBody.getAttribute('data-isOAuth-done');

        console.log('verification called')

        if ( isOAuthDone === 'true' ) {
            // Expose Soundcloud API to parent window
            window.scAPI = elIframe.contentWindow.SC;
            window.scAccessToken = elIframe.contentWindow.SC.accessToken();
            // stop verification
            window.clearInterval(OAuthVerification)

            // Start the App
            document.body.setAttribute('data-isVisible', 'true');
            angular.bootstrap(document, ['App']);

            console.log('verification done')
        }
    }

    return {
        verification: verification
    }
})();

var OAuthVerification = window.setInterval( exposeSoundCloudAPI.verification, 1500);

/**
 * API SOUNDCLOUD ENDPOINTS
 * https://developers.soundcloud.com/docs/api/reference#me
 */

// Get me (user)
// "https://api.soundcloud.com/me.json?oauth_token=A_VALID_TOKEN"