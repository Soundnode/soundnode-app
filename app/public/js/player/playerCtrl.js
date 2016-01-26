'use strict';

app.controller('PlayerCtrl', function ($scope, $rootScope, playerService, queueService, hotkeys, $state, $log, $timeout) {
    $scope.imgPath = 'public/img/temp-playing.png';

    $timeout(function() {
        if(window.localStorage.volume) {
            $scope.volume = window.localStorage.volume;
            playerService.volume($scope.volume);
        } else {
            $scope.volume = 1.0;
            playerService.volume($scope.volume);
            window.localStorage.volume = $scope.volume;
        }
    });

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

    $scope.lock = function($event) {
        var elButton = document.querySelector('.player_lock');
        elButton.classList.toggle('active');

        if ( $rootScope.lock ) {
            $rootScope.lock = false;
        } else {
            $rootScope.lock = true;
        }
    };

    $scope.repeat = function($event) {
        var elButton = document.querySelector('.player_repeat');
        elButton.classList.toggle('active');

        if ( $rootScope.repeat ) {
            $rootScope.repeat = false;
        } else {
            $rootScope.repeat = true;
        }
    };

    $scope.shuffle = function($event) {
        var elButton = document.querySelector('.player_shuffle');
        elButton.classList.toggle('active');

        if ( $rootScope.shuffle ) {
            $rootScope.shuffle =  false;
        } else {
            $rootScope.shuffle = true;
        }
    };

    $scope.toggleQueue = function($event) {
        var elButton = document.querySelector('.player_queueList');
        elButton.classList.toggle('active');
        document.querySelector('.queueList').classList.toggle('active');
    };

    $scope.goToSong = function ($event) {
        var trackObj = queueService.getTrack();
        $state.go('track', { id: trackObj.songId });
    };

    $scope.goToUser = function ($event) {
        var trackObj = queueService.getTrack();
        $state.go('profile', { id: trackObj.songUserId });
    };


    /*
    * Add native media shortcuts
    */

    var playPause = new gui.Shortcut({
        key: 'MediaPlayPause',
        active: function() {
            $scope.$apply(function() {
                if ( $rootScope.isSongPlaying ) {
                    playerService.pauseSong();
                } else {
                    playerService.playSong();
                }
            });
        },
        failed: function() {
            // nothing here
        }
    });

    var stop = new gui.Shortcut({
        key: 'MediaStop',
        active: function() {
            $scope.$apply(function() {
                if ( $rootScope.isSongPlaying ) {
                    playerService.pauseSong();
                }
            });
        },
        failed: function() {
            // nothing here
        }
    });

    var prevTrack = new gui.Shortcut({
        key: 'MediaPrevTrack',
        active: function() {
            $scope.$apply(function() {
                if ( $rootScope.isSongPlaying ) {
                    playerService.playPrevSong();
                }
            });
        },
        failed: function() {
            // nothing here
        }
    });

    var nextTrack = new gui.Shortcut({
        key: 'MediaNextTrack',
        active: function() {
            $scope.$apply(function() {
                if ( $rootScope.isSongPlaying ) {
                    playerService.playNextSong();
                }
            });
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
        combo: ['command+return', 'ctrl+return'],
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
        combo: 'ctrl+right',
        description: 'Next song',
        callback: function() {
            if ( $rootScope.isSongPlaying ) {
                playerService.playNextSong();
            }
        }
    });

    hotkeys.add({
        combo: 'ctrl+left',
        description: 'Prev song',
        callback: function() {
            if ( $rootScope.isSongPlaying ) {
                playerService.playPrevSong();
            }
        }
    });

    hotkeys.add({
        combo: ['command+up', 'ctrl+up'],
        description: 'Volume Up',
        callback: function(e) {
        	e.preventDefault();
            playerService.volume(playerService.volume() + 0.1);
            $scope.volume = playerService.volume();
        }
    });

    hotkeys.add({
        combo: ['command+down', 'ctrl+down'],
        description: 'Volume Down',
        callback: function(e) {
        	e.preventDefault();
            playerService.volume(playerService.volume() - 0.1);
            $scope.volume = playerService.volume();
        }
    });

    hotkeys.add({
        combo: ['shift+q'],
        description: 'Toggle Queue',
        callback: function(e) {
            e.preventDefault();
            $scope.toggleQueue()
        }
    });

    hotkeys.add({
        combo: ['shift+r'],
        description: 'Toggle repeat on/off',
        callback: function(e) {
            e.preventDefault();
            $scope.repeat()
        }
    });

    hotkeys.add({
        combo: ['shift+s'],
        description: 'Toggle shuffle on/off',
        callback: function(e) {
            e.preventDefault();
            $scope.shuffle()
        }
    });

    hotkeys.add({
        combo: ['shift+l'],
        description: 'Toggle lock on/off',
        callback: function(e) {
            e.preventDefault();
            $scope.lock()
        }
    });


});
