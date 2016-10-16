"use strict";

let authentication = {};
let authenticationId;

authentication.init = function () {
  let that = this;
  let popUp;

  if (userConfig.checkAuth()) {
    this.startApp();
    return;
  }

  popUp = window.open('http://sc-redirect.herokuapp.com/', {
    show: false
  });

  authenticationId = window.setInterval(function () {
    that.verification(popUp);
  }, 1500);
};

authentication.verification = function (popUp) {
  let isOAuthDone;

  console.log('verification called');

  if (popUp.window.document.body !== null) {
    isOAuthDone = popUp.window.document.body.getAttribute('data-isOAuth-done');
  }

  if (isOAuthDone !== 'true') return;

  // Expose Soundcloud API to node-webkit object window
  window.SC = popUp.window.SC;
  window.scAccessToken = popUp.window.SC.accessToken();
  window.scClientId = popUp.window.SC.options.client_id;

  // close popUp
  popUp.close();
  // stop verification
  window.clearInterval(authenticationId);

  // save user to localStorage
  userConfig.saveUser();

  console.log('verification done');

  // start the App
  this.startApp();
};

authentication.startApp = function () {
  setTimeout(function () {
    angular.bootstrap(document, ['App']);
    document.body.setAttribute('data-isVisible', 'true');
  }, 2000)
};

module.exports = {
  authentication: authentication
}