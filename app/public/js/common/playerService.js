/**
 * USER SCENARIOS QUEUE
 *
 * scenario_1:
 * User click on track when no track is playing or paused
 * and Queue is empty.
 * track clicked is added to first in the Queue
 * and all track clicked siblings added next in Queue
 *
 * scenario_2:
 * User play track and player is playing track
 * add clicked track next to current playing track in queue
 * and play clicked song
 *
 * scenario_3:
 * User play track but view is different
 * queue is cleaned, track clicked is added to first in the queue
 * and all tracks next to track clicked are added to queue
 *
 */

'use strict';

const { webFrame } = require('electron');

/**
 * Set a max timeout for when the user tries to go back a song
 * If the user is over the timeout, Lets restart the song instead of go to the previous track
 */
const SONG_TIMEOUT_THRESHOLD = 3;

app.factory('playerService', function (
  $rootScope,
  $log,
  $timeout,
  $window,
  $state,
  mprisService,
  notificationFactory,
  queueService,
  utilsService,
  modalFactory,
  osNotificationService
) {

  $rootScope.isSongPlaying = false;
  $rootScope.isPlaylistPlaying = false;
  $rootScope.shuffle = false;
  $rootScope.repeat = false;
  $rootScope.lock = false;

  /**
   * Contain player actions
   * play/pause song
   * prev/next song
   * @type {Object}
   */
  var player = {};

  /**
   * Player DOM element's
   */
  player.elPlayer = document.getElementById('player');
  player.elPlayerProgress = document.getElementById('player-progress');
  player.elPlayerDuration = document.getElementById('player-duration');
  player.elPlayerTimeCurrent = document.getElementById('player-timecurrent');
  player.elPlayerFavorite = angular.element(document.querySelector('.player_favorite'));
  player.elThumb = document.getElementById('playerThumb');
  player.elTitle = document.getElementById('playerTitle');
  player.elUser = document.getElementById('playerUser');

  /**
   * Adjust player volume
   * @param value [volume level]
   * @method volume
   */
  player.volume = function (value) {
    if (typeof value === "undefined") {
      return player.elPlayer.volume;
    }
    if (value >= 0 && value <= 1) {
      player.elPlayer.volume = parseFloat(value).toFixed(1);
      $window.localStorage.volume = parseFloat(value).toFixed(1);
    }
  };

  /**
   * Responsible to check if there's a song
   * playing if so check if the clicked song
   * is the current song playing and call pause
   * otherwise play song clicked
   * @param clickedSong [track DOM element]
   * @method songClicked
   */
  player.songClicked = function (clickedSong) {
    var currentElSiblings;
    var trackPosition;
    var currentElData = $(clickedSong).data();

    if ($rootScope.oldView !== '' &&
      $rootScope.currentView !== $rootScope.oldView &&
      !queueService.find(currentElData.songId) &&
      !queueService.isEmpty()
    ) {
      queueService.clear();
    }

    if (this.elPlayer.currentTime !== 0 && !this.elPlayer.paused && clickedSong === utilsService.getCurrentSong()) { // song playing is equal to song clicked
      this.pauseSong();
    } else if (this.elPlayer.currentTime !== 0 && this.elPlayer.paused && clickedSong === utilsService.getCurrentSong()) { // song playing but paused is equal to song clicked
      this.playSong();
    } else if (this.elPlayer.currentTime === 0 && this.elPlayer.paused || clickedSong !== utilsService.getCurrentSong()) { // there's no song playing or song clicked not equal to current song paying

      if (queueService.isEmpty() || utilsService.isLastTrackInQueue()) {
        currentElSiblings = utilsService.getSongSiblingsData(clickedSong);
        queueService.insert(currentElData);
        queueService.push(currentElSiblings);
      } else {

        // find track in the Queue
        trackPosition = queueService.find(currentElData.songId);
        if (trackPosition === 0 || trackPosition > 0) {
          queueService.currentPosition = trackPosition;
        } else {
          queueService.insert(currentElData);
          queueService.next();
        }

      }

      this.playNewSong();
    }
  };

  /**
   * Get track from Queue current position
   * and play it
   * @method playNewSong
   */
  player.playNewSong = function () {
    var trackUrl;
    var that = this;
    var trackObj = queueService.getTrack();
    var trackObjId = trackObj.songId;
    var duration = player.elPlayer.duration * 1000;

    utilsService.deactivateCurrentSong();
    utilsService.activateCurrentSong(trackObjId);

    if (trackObj.songThumbnail === '' || trackObj.songThumbnail === null) {
      trackObj.songThumbnail = 'public/img/song-placeholder.png';
    }

    trackUrl = trackObj.songUrl + '?client_id=' + window.localStorage.scClientId;

    // check rate limit
    utilsService.isPlayable(trackUrl).then(function () {
      that.elPlayer.setAttribute('src', trackUrl);
      that.elThumb.setAttribute('src', trackObj.songThumbnail);
      that.elThumb.setAttribute('alt', trackObj.songTitle);
      that.elTitle.innerHTML = trackObj.songTitle;
      that.elTitle.setAttribute('title', trackObj.songTitle);
      that.elUser.innerHTML = trackObj.songUser;
      that.elPlayer.play();

      // show OS notification
      osNotificationService.show(trackObj);

      // Make sure the favorite heart is active if user liked it
      utilsService.updateTracksLikes([trackObj], true) // use cache to start
        .then(function () {
          if (trackObj.user_favorite) {
            that.elPlayerFavorite.addClass('active');
          }
        });

      $rootScope.isSongPlaying = true;
      $rootScope.$broadcast('activateQueue');

      // remove the active class from player favorite icon before play new song
      // TODO: this should check if the current song is already favorited
      document.querySelector('.player_favorite').classList.remove('active');

      // mpris only supports linux
      if (process.platform === "linux" && mprisService) {
        // tell mpris that we're now playing & send off the attributes for dbus to use.
        mprisService.play("0", duration, trackObj.songThumbnail, trackObj.songTitle, trackObj.songUser);
      }
    }, function (response) {
      modalFactory.rateLimitReached(response);
    });
  };

  // Updates cache when liking or unliking a song, so future checks will be correct
  $rootScope.$on('track::favorited', function (event, trackId) {
    utilsService.addCachedFavorite(trackId);
  });
  $rootScope.$on('track::unfavorited', function (event, trackId) {
    utilsService.removeCachedFavorite(trackId);
  });

  /**
   * Responsible to play song
   * @method playSong
   */
  player.playSong = function () {
    var duration = player.elPlayer.duration * 1000;

    this.elPlayer.play();
    $rootScope.isSongPlaying = true;

    /**
     * linux mpris passthrough for media keys & desktop integration
     */
    if (process.platform === "linux" && mprisService) {
      mprisService.play("0", duration, player.elThumb.src, player.elTitle.innerHTML, player.elUser.innerHTML);
    }
  };

  /**
   * Responsible to pause song
   * @method pauseSong
   */
  player.pauseSong = function () {
    this.elPlayer.pause();
    $rootScope.isSongPlaying = false;

    /**
     * linux mpris passthrough for media keys & desktop integration
     */
    if (process.platform === "linux" && mprisService) {
      mprisService.pause();
    }
  };

  /**
   * Sets the songs time to 0 & then pauses the song, stopping the song.
   */
  player.stopSong = function () {
    // Set time to 0
    player.setSongTime(0);

    // Set a paused state
    player.pauseSong();
  };

  /**
   * Responsible to check if there's a song
   * playing if so check the current song and
   * play previous song on the list
   * @method playPrevSong
   */
  player.playPrevSong = function () {
    if ($rootScope.lock) {
      return false;
    }
    if (SONG_TIMEOUT_THRESHOLD < player.elPlayer.currentTime) {
      player.elPlayer.currentTime = 0;
      return false;
    }
    if ($rootScope.shuffle && !$rootScope.repeat) {
      utilsService.shuffle();
    } else if (!$rootScope.repeat) {
      queueService.prev();
    }

    this.playNewSong();
  };

  /**
   * Responsible to check if there's a song
   * playing if so check the current song and
   * play next song on the list
   * @method playPrevSong
   */
  player.playNextSong = function () {

    if ($rootScope.lock) {
      return false;
    }

    if ($rootScope.shuffle && !$rootScope.repeat) {
      utilsService.shuffle();
    } else if (!$rootScope.repeat && utilsService.isLastTrackInQueue()) {
      utilsService.scrollToBottom();
      utilsService.addLoadedTracks();
    } else if (!$rootScope.repeat && !utilsService.isLastTrackInQueue()) {
      queueService.next();
    }

    this.playNewSong();
  };

  /**
   * Set the song time.
   * @param  {Number} time The time in milliseconds you want to set
   */
  player.setSongTime = function (time) {
    if (isNaN(time)) throw new Error("You can only set time with a number");
    return document.getElementById('player').currentTime = time;
  }

  /**
   * Add event listener "on ended" to player
   */
  $(player.elPlayer).off().on('ended', function () {
    $rootScope.isSongPlaying = false;
    player.playNextSong();
  });

  /**
   * Add event listener "time update" to song bar progress
   * and song timer progress
   */
  $(player.elPlayer).bind('timeupdate', function () {

    var pos = (player.elPlayer.currentTime / player.elPlayer.duration) * 100;
    var mins = Math.floor(player.elPlayer.currentTime / 60, 10);
    var secs = Math.floor(player.elPlayer.currentTime, 10) - mins * 60;

    if (!isNaN(mins) || !isNaN(secs)) {
      $(player.elPlayerTimeCurrent).text(mins + ':' + (secs > 9 ? secs : '0' + secs));
    }

    $(player.elPlayerProgress).css({
      width: pos + '%'
    });
  });

  /**
   * Add event listener "loaded data" to update track
   * duration only once
   */
  $(player.elPlayer).bind('loadeddata', function () {

    var mins = Math.floor(player.elPlayer.duration / 60, 10),
      secs = Math.floor(player.elPlayer.duration, 10) - mins * 60;

    if (!isNaN(mins) || !isNaN(secs)) {
      $(player.elPlayerDuration).text(mins + ':' + (secs > 9 ? secs : '0' + secs));
      $(player.elPlayerTimeCurrent).text('0:00');
    }

  });

  /**
   * Responsible to add scrubbing
   * drag or click scrub on track progress bar
   */
  var scrub = $(player.elPlayerProgress).parent().off();

  function scrubTimeTrack(e, el) {
    var percent = (e.offsetX / $(el).width());
    var duration = player.elPlayer.duration;
    var scale = parseFloat(webFrame.getZoomFactor());
    var seek = (percent * duration) / scale;

    if (player.elPlayer.networkState === 0 || player.elPlayer.networkState === 3) {
      notificationFactory.error("Something went wrong. I can't play this track :(");
    }

    if (player.elPlayer.readyState > 0) {
      player.elPlayer.currentTime = parseInt(seek, 10)
    }
  }

  /**
   * Manage scrub interaction / event handling
   */

  var allowClick = true;

  scrub.on('click', function (e) {
    var el = this;

    // this stops the click event on window.blur
    if (allowClick) {
      scrubTimeTrack(e, el);
    }
  });

  var $$window = $($window);

  $$window.on({
    blur: function () { allowClick = false },
    focus: function () { allowClick = true }
  })

  function releaseScrub(e) {
    // delay permission for text selection to allow some room for mouse release by the user
    setTimeout(function () {
      document.body.classList.remove('unselectable-text');
    }, 1000);

    $$window.off('.scrubevents');
    scrub.off('.scrubevents');
    scrub.removeClass('mousetrap');
  }

  scrub.on('mousedown', function (e) {
    // prevent undesired text select
    document.body.classList.add('unselectable-text');

    // mouse movement threshold
    scrub.addClass('mousetrap');

    scrub.on('mousemove.scrubevents', function (e) {
      var el = this;

      scrubTimeTrack(e, el);
      $window.getSelection().empty();
    });

    scrub.on('mouseup.scrubevents mouseleave.scrubevents', releaseScrub);
    $$window.on('blur.scrubevents', releaseScrub);
  });

  return player;
});
