"use strict";

function startApp() {
  setTimeout(function () {
    angular.bootstrap(document, ['App']);
    document.body.setAttribute('data-isVisible', 'true');
  }, 2000);
}

startApp();