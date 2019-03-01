'use strict';

app.controller('PlayerCtrl', function (
  $scope,
  $rootScope,
  $window,
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

  if ($window.localStorage.volume) {
    $scope.volume = +$window.localStorage.volume;
    playerService.volume($scope.volume);
  } else {
    $scope.volume = 1.0;
    playerService.volume($scope.volume);
    $window.localStorage.volume = +$scope.volume;
  }

  /**
   * Show/Hide volume range
   * @type {exports}
   */
  $scope.isVisible = false;
  $scope.toggleRange = function () {
    $scope.isVisible = !$scope.isVisible;
  };

  /**
   * Responsible to send a new volume
   * value on range change
   * @param volume [value of the volume]
   * @method adjustVolume
   */
  $scope.adjustVolume = function (volume) {
    playerService.volume(volume);
  };

  $scope.playPause = function ($event) {
    togglePlayPause();
  };

  $scope.prevSong = function ($event) {
    if ($rootScope.isSongPlaying) {
      playerService.playPrevSong();
    }
  };

  $scope.nextSong = function ($event) {
    if ($rootScope.isSongPlaying) {
      playerService.playNextSong();
    }
  };

  $scope.lock = function ($event) {
    var elButton = document.querySelector('.player_lock');
    elButton.classList.toggle('active');
    $rootScope.lock = !$rootScope.lock;
  };

  $scope.repeat = function ($event) {
    var elButton = document.querySelector('.player_repeat');
    elButton.classList.toggle('active');
    $rootScope.repeat = !$rootScope.repeat;
  };

  $scope.shuffle = function ($event) {
    var elButton = document.querySelector('.player_shuffle');
    elButton.classList.toggle('active');
    $rootScope.shuffle = !$rootScope.shuffle;
  };

  $scope.toggleQueue = function ($event) {
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

  $scope.favorite = function ($event) {
    var userId = $rootScope.userId;
    var track = queueService.getTrack();

    if ($event.currentTarget.classList.contains('active')) {

      SCapiService.deleteFavorite(userId, track.songId)
        .then(function (status) {
          if (typeof status == "object") {
            notificationFactory.warn("Song removed from likes!");
            $event.currentTarget.classList.remove('active');
            $rootScope.$broadcast("track::unfavorited", track.songId);
          }
        }, function () {
          notificationFactory.error("Something went wrong!");
        })
    } else {
      SCapiService.saveFavorite(userId, track.songId)
        .then(function (status) {
          if (typeof status == "object") {
            notificationFactory.success("Song added to likes!");
            $event.currentTarget.classList.add('active');
            $rootScope.$broadcast("track::favorited", track.songId);
          }
        }, function (status) {
          notificationFactory.error("Something went wrong!");
        });
    }
  };

  // Listen for updates from other scopes about favorites and unfavorites
  $scope.$on('track::favorited', function (event, trackId) {
    var track = queueService.getTrack();
    if (track && trackId == track.songId) {
      var elFavorite = document.querySelector('.player_favorite');
      elFavorite.classList.add('active');
    }
  });
  $scope.$on('track::unfavorited', function (event, trackId) {
    var track = queueService.getTrack();
    if (track && trackId == track.songId) {
      var elFavorite = document.querySelector('.player_favorite');
      elFavorite.classList.remove('active');
    }
  });

  /**
   * Used between multiple functions, so we'll leave it here so it reduces
   * the amount of times we define it.
   */
  var togglePlayPause = function () {
    var track = queueService.getTrack();

    if ($rootScope.isSongPlaying || track == null) {
      playerService.pauseSong();
    } else {
      playerService.playSong();
    }
  };


  /*
  * Add native media shortcuts
  */
  ipcRenderer.on('MediaPlayPause', () => {
    $scope.$apply(function () {
      togglePlayPause();
    });
  });

  ipcRenderer.on('MediaStop', () => {
    $scope.$apply(function () {
      if ($rootScope.isSongPlaying) {
        playerService.stopSong();
      }
    });
  });

  ipcRenderer.on('MediaPreviousTrack', () => {
    $scope.$apply(function () {
      if ($rootScope.isSongPlaying) {
        playerService.playPrevSong();
      }
    });
  });

  ipcRenderer.on('MediaNextTrack', () => {
    $scope.$apply(function () {
      if ($rootScope.isSongPlaying) {
        playerService.playNextSong();
      }
    });
  });

  /**
   * Add native media shortcuts for linux based systems
   */
  if (process.platform === "linux" && mprisService) {
    // Set a default state
    mprisService.playbackStatus = mprisService.playbackStatus || "Stopped";

    // When the user toggles play/pause
    mprisService.on("playpause", function () {
      togglePlayPause();
    });

    // When the user stops the song
    mprisService.on("stop", function () {
      playerService.stopSong();
    });

    // When the user requests next song
    mprisService.on("next", function () {
      playerService.playNextSong();
    });

    // When the user requests previous song
    mprisService.on("previous", function () {
      playerService.playPrevSong();
    });

    // When the user toggles shuffle
    mprisService.on("shuffle", function () {
      playerService.shuffle();
    });
  }

  //TODO: replace all hotkeys to native electrom commands
  hotkeys.add({
    combo: 'space',
    description: 'Play/Pause song',
    callback: function (event) {
      event.preventDefault();
      togglePlayPause();
    }
  });

  hotkeys.add({
    combo: ['command+return', 'ctrl+return'],
    description: 'Play/Pause song',
    callback: function () {
      togglePlayPause();
    }
  });

  hotkeys.add({
    combo: 'ctrl+right',
    description: 'Next song',
    callback: function () {
      if ($rootScope.isSongPlaying) {
        playerService.playNextSong();
      }
    }
  });

  hotkeys.add({
    combo: 'ctrl+left',
    description: 'Prev song',
    callback: function () {
      if ($rootScope.isSongPlaying) {
        playerService.playPrevSong();
      }
    }
  });

  hotkeys.add({
    combo: ['command+up', 'ctrl+up'],
    description: 'Volume Up',
    callback: function (e) {
      e.preventDefault();
      playerService.volume(playerService.volume() + 0.1);
      $scope.volume = playerService.volume();
    }
  });

  hotkeys.add({
    combo: ['command+down', 'ctrl+down'],
    description: 'Volume Down',
    callback: function (e) {
      e.preventDefault();
      playerService.volume(playerService.volume() - 0.1);
      $scope.volume = playerService.volume();
    }
  });

  hotkeys.add({
    combo: ['command+l', 'ctrl+l'],
    description: 'Heart track',
    callback: function () {
      $timeout(function () {
        angular.element(".player_favorite").triggerHandler('click');
      }, 0);
    }
  });

  hotkeys.add({
    combo: ['shift+q'],
    description: 'Toggle Queue',
    callback: function (e) {
      e.preventDefault();
      $scope.toggleQueue()
    }
  });

  hotkeys.add({
    combo: ['shift+r'],
    description: 'Toggle repeat on/off',
    callback: function (e) {
      e.preventDefault();
      $scope.repeat()
    }
  });

  hotkeys.add({
    combo: ['shift+s'],
    description: 'Toggle shuffle on/off',
    callback: function (e) {
      e.preventDefault();
      $scope.shuffle()
    }
  });

  hotkeys.add({
    combo: ['shift+l'],
    description: 'Toggle lock on/off',
    callback: function (e) {
      e.preventDefault();
      $scope.lock()
    }
  });


});
