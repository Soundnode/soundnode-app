'use strict';

var http = require('http');

app.controller('PlayerCtrl', function (
    $scope,
    $rootScope,
    playerService,
    mprisService,
    queueService,
    hotkeys,
    $state,
    $log,
    $timeout,
    SCapiService,
    notificationFactory
) {
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
        $scope.isVisible = !$scope.isVisible;
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
        $rootScope.lock = !$rootScope.lock;
    };

    $scope.repeat = function($event) {
        var elButton = document.querySelector('.player_repeat');
        elButton.classList.toggle('active');
        $rootScope.repeat = !$rootScope.repeat;
    };

    $scope.shuffle = function($event) {
        var elButton = document.querySelector('.player_shuffle');
        elButton.classList.toggle('active');
        $rootScope.shuffle = !$rootScope.shuffle;
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

    $scope.favorite = function($event) {
        var userId = $rootScope.userId;
        var track = queueService.getTrack();

        if ( $event.currentTarget.classList.contains('active') ) {

            SCapiService.deleteFavorite(userId, track.songId)
                .then(function(status) {
                    if ( typeof status == "object" ) {
                        notificationFactory.warn("Song removed from likes!");
                        $event.currentTarget.classList.remove('active');
                        $rootScope.$broadcast("track::unfavorited", track.songId);
                    }
                }, function() {
                    notificationFactory.error("Something went wrong!");
                })
        } else {
            SCapiService.saveFavorite(userId, track.songId)
                .then(function(status) {
                    if ( typeof status == "object" ) {
                        notificationFactory.success("Song added to likes!");
                        $event.currentTarget.classList.add('active');
                        $rootScope.$broadcast("track::favorited",  track.songId);
                    }
                }, function(status) {
                    notificationFactory.error("Something went wrong!");
                });
        }
    };

    // Listen for updates from other scopes about favorites and unfavorites
    $scope.$on('track::favorited', function(event, trackId) {
        var track = queueService.getTrack();
        if ( track && trackId == track.songId ) {
            var elFavorite = document.querySelector('.player_favorite');
            elFavorite.classList.add('active');
        }
    });
    $scope.$on('track::unfavorited', function(event, trackId) {
        var track = queueService.getTrack();
        if ( track && trackId == track.songId ) {
            var elFavorite = document.querySelector('.player_favorite');
            elFavorite.classList.remove('active');
        }
    });

    /**
     * Used between multiple functions, so we'll leave it here so it reduces
     * the amount of times we define it.
     */
    var togglePlayPause = function() {
        if ( $rootScope.isSongPlaying ) {
            playerService.pauseSong();
        } else {
            playerService.playSong();
        }
    };


    /*
    * Add native media shortcuts
    */
    var playPause = new gui.Shortcut({
        key: 'MediaPlayPause',
        active: function() {
            $scope.$apply(function() {
                togglePlayPause();
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
                    playerService.stopSong();
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

    /**
     * Add native media shortcuts for linux based systems
     */
     if(process.platform === "linux") {
         // Set a default state
         mprisService.playbackStatus = mprisService.playbackStatus || "Stopped";

         // When the user toggles play/pause
         mprisService.on("playpause", function() {
             togglePlayPause();
         });

         // When the user stops the song
         mprisService.on("stop", function() {
             playerService.stopSong();
         });

         // When the user requests next song
         mprisService.on("next", function() {
             playerService.playNextSong();
         });

         // When the user requests previous song
         mprisService.on("previous", function() {
             playerService.playPrevSong();
         });

         // When the user toggles shuffle
         mprisService.on("shuffle", function() {
             playerService.shuffle();
         });
     }

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
            togglePlayPause();
        }
    });

    hotkeys.add({
        combo: ['command+return', 'ctrl+return'],
        description: 'Play/Pause song',
        callback: function() {
            togglePlayPause();
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


    var server = http.createServer(function (req, res) {
        switch (req.url) {
            case '/playpause':
                if ($rootScope.isSongPlaying) {
                    playerService.pauseSong();
                } else {
                    playerService.playSong();
                }
                break;
            case '/prev':
                if ($rootScope.isSongPlaying) {
                    playerService.playPrevSong();
                }
                break;
            case '/next':
                if ($rootScope.isSongPlaying) {
                    playerService.playNextSong();
                }
                break;
        }
        res.end(`
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>HTTP Controller for Soundnode</title>
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet">
                    <style>
                        body {
                            background: -webkit-linear-gradient(45deg, #d0303e 0%, #b32841 25%, #9a2b4d 50%, #7c3a6d 75%, #5d3375 100%);
                            background: linear-gradient(45deg, #d0303e 0%, #b32841 25%, #9a2b4d 50%, #7c3a6d 75%, #5d3375 100%);
                            color: #fff;
                            width: 100vw;
                            height: 100vh;
                            margin: 0;
                        }
                        .controls {
                            background-color: #222326;
                            position: fixed;
                            width: 100vw;
                            height: 48px;
                            bottom: 0;
                        }
                        .controls ul {
                            padding: 0;
                            margin: 0;
                            display: -webkit-box;
                            display: -webkit-flex;
                            display: -ms-flexbox;
                            display: flex;
                            -webkit-box-pack: center;
                            -webkit-justify-content: center;
                                -ms-flex-pack: center;
                                    justify-content: center;
                        }
                        .controls ul li {
                            display: inline-block;
                            margin: 8px;
                        }
                        .controls ul li a {
                            text-decoration: none;
                        }
                        .controls ul li a::before {
                            color: #fff;
                            font-size: 32px;
                        }
                    </style>
                </head>
                <body>
                    <div class="controls">
                        <ul>
                            <li><a href="/prev" class="fa fa-step-backward"></a></li>
                            <li><a href="/playpause" class="fa fa-play"></a></li>
                            <li><a href="/next" class="fa fa-step-forward"></a></li>
                        </ul>
                    </div>
                </body>
            </html>
        `);
    });
    server.listen(8319);

});
