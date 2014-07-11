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

    $scope.formatSongDuration = function(duration) {
        var minutes = Math.floor(duration / 60000)
            , seconds = ((duration % 60000) / 1000).toFixed(0);
        
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }
});