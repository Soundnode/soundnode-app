'use strict'

app.controller('playerCtrl', function ($scope, $rootScope, playerService) {
    $scope.imgPath = 'public/img/temp-playing.png';
    
    $scope.playPause = function($event) {
        if ( $rootScope.isSongPlaying ) {
            playerService.pauseSong();
        } else {
            playerService.playSong();
        }
    };

    $scope.prevSong = function($event) {
        if ( $rootScope.isSongPlaying ) {
             playerService.playPrevSong();
        }
    };

    $scope.nextSong = function($event) {
        if ( $rootScope.isSongPlaying ) {
             playerService.playNextSong();
        }
    };

});