'use strict'

app.controller('PlayerCtrl', function ($scope, $rootScope, playerService) {
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

    hotkeys.add({
        combo: 'ctrl+right',
        description: 'This one goes to 11',
        callback: function() {
            if ( $rootScope.isSongPlaying ) {
                playerService.playNextSong();
            }
        }
    });

    hotkeys.add({
        combo: 'ctrl+left',
        description: 'This one goes to 11',
        callback: function() {
            if ( $rootScope.isSongPlaying ) {
                playerService.playPrevSong();
            }
        }
    });

});