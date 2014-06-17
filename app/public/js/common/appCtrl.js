'use strict'

app.controller('AppCtrl', function ($scope) {

    $scope.showBigArtwork = function (img) {
        var newArtwork;
        if ( img !== null ) {
            newArtwork = img.replace('large', 't300x300');
            return newArtwork;
        } else {
            newArtwork = 'public/img/logo-short.png';
            return newArtwork;
        }
    }
});