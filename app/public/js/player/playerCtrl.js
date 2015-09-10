'use strict';

app.controller('PlayerCtrl', function ($scope, $rootScope, playerService, hotkeys, $log, $timeout) {
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

    $scope.repeat = function($event) {
        var button = $event.currentTarget;

        if ( button.classList.contains('active') &&
            button.classList.contains('locked')
        ) { // both states are true therefore remove classes
            button.classList.remove('active', 'locked');
            $rootScope.repeat = false;
            $rootScope.repeatLocked = false;
        } else if ( button.classList.contains('active') &&
            ! button.classList.contains('locked')
        ) { // active state is true but locked is false, add locked class
            button.classList.add('locked');
            $rootScope.repeat = false;
            $rootScope.repeatLocked = true;
        } else if ( ! button.classList.contains('active') ) { // both states are false, add active class
            button.classList.add('active');
            $rootScope.repeat = true;
            $rootScope.repeatLocked = false;
        }
    };

    $scope.shuffle = function($event) {
        $event.currentTarget.classList.toggle('active');
        if ( $rootScope.shuffle ) {
            $rootScope.shuffle =  false;
        } else {
            $rootScope.shuffle = true;
        }
    };

    $scope.toggleQueue = function($event) {

        $event.currentTarget.classList.toggle('active');
        document.querySelector('.queueList').classList.toggle('active');
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
        combo: ['command+right', 'ctrl+right'],
        description: 'Next song',
        callback: function() {
            if ( $rootScope.isSongPlaying ) {
                playerService.playNextSong();
            }
        }
    });

    hotkeys.add({
        combo: ['command+left', 'ctrl+left'],
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


});
