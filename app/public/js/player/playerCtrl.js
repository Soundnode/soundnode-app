'use strict'

app.controller('PlayerCtrl', function ($scope, $rootScope, playerService, hotkeys, $log) {
    $scope.imgPath = 'public/img/temp-playing.png';

    /**
     * Show/Hide volume range
     * @type {exports}
     */
    $scope.isVisible = false;
    $scope.toggleRange = function() {
        if ( $scope.isVisible ) {
            $scope.isVisible = false;
        } else {
            $scope.isVisible = true;
        }
    };

    /**
     * Responsible to send a new volume
     * value on range change
     * @param volume [value of the volume]
     * @method adjustVolume
     */
    $scope.adjustVolume = function(volume) {
        $log.log('volume', volume);
        playerService.volume(volume);
    };

    var gui = require('nw.gui');

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


    /*
    * Add native media shortcuts
    */

    var playPause = new gui.Shortcut({
        key: 'MediaPlayPause',
        active: function() {
            if ( $rootScope.isSongPlaying ) {
                playerService.pauseSong();
            } else {
                playerService.playSong();
            }
        },
        failed: function() {
            // nothing here
        }
    });

    var stop = new gui.Shortcut({
        key: 'MediaStop',
        active: function() {
            if ( $rootScope.isSongPlaying ) {
                playerService.pauseSong();
            }
        },
        failed: function() {
            // nothing here
        }
    });

    var prevTrack = new gui.Shortcut({
        key: 'MediaPrevTrack',
        active: function() {
            if ( $rootScope.isSongPlaying ) {
                playerService.playPrevSong();
            }
        },
        failed: function() {
            // nothing here
        }
    });

    var nextTrack = new gui.Shortcut({
        key: 'MediaNextTrack',
        active: function() {
            if ( $rootScope.isSongPlaying ) {
                playerService.playNextSong();
            }
        },
        failed: function() {
            // nothing here
        }
    });

    gui.App.registerGlobalHotKey(playPause);
    gui.App.registerGlobalHotKey(stop);
    gui.App.registerGlobalHotKey(prevTrack);
    gui.App.registerGlobalHotKey(nextTrack);

//    function unregister() {
//        gui.App.unregisterGlobalHotKey(shortcut);
//    }

    //
    // Add not native shortcuts
    //

    hotkeys.add({
        combo: 'space',
        description: 'Play/Pause song',
        callback: function(event) {
            event.preventDefault();
            if ( $rootScope.isSongPlaying ) {
                playerService.pauseSong();
            } else {
                playerService.playSong();
            }
        }
    });

    hotkeys.add({
        combo: 'command+return',
        description: 'Play/Pause song',
        callback: function() {
            if ( $rootScope.isSongPlaying ) {
                playerService.pauseSong();
            } else {
                playerService.playSong();
            }
        }
    });

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


});