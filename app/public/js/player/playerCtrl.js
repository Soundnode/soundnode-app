'use strict'

app.controller('PlayerCtrl', function ($scope, $rootScope, playerService, hotkeys) {
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
        combo: 'command+right',
        description: 'Next song',
        callback: function() {
            if ( $rootScope.isSongPlaying ) {
                playerService.playNextSong();
            }
        }
    });

    hotkeys.add({
        combo: 'command+left',
        description: 'Prev song',
        callback: function() {
            if ( $rootScope.isSongPlaying ) {
                playerService.playPrevSong();
            }
        }
    });

    hotkeys.add({
        combo: 'command+return',
        description: 'Play song',
        callback: function() {
            if ( $rootScope.isSongPlaying ) {
                playerService.pauseSong();
            } else {
                playerService.playSong();
            }
        }
    });

    hotkeys.add({
        combo: 'command+up',
        description: 'Volume up',
        callback: function(event) {
            event.preventDefault();
            playerService.volumeUp();
        }
    });

    hotkeys.add({
        combo: 'command+down',
        description: 'Volume down',
        callback: function(event) {
            event.preventDefault();
            playerService.volumeDown();
        }
    });


});