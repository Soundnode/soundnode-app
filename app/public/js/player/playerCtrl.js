'use strict'

app.controller('playerCtrl', function ($scope) {
    $scope.imgPath = 'public/img/temp-playing.png';

    $scope.playPause = function($event) {
        var el = $event.currentTarget;

        if ( el.classList.contains('playing') ) {
            el.classList.remove('playing');
        } else {
            el.classList.add('playing');
        }
    };
});