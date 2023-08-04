"use strict";

function startApp(): void {
  setTimeout(function (): void {
    angular.bootstrap(document, ['App']);
    document.body.setAttribute('data-isVisible', 'true');
  }, 2000);
}

startApp();