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

import { webFrame } from 'electron';

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
  const player = {};

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
    let currentElSiblings;
    let trackPosition;
    const currentElData = $(clickedSong).data();

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
    let trackUrl;
    const that = this;
    const trackObj = queueService.getTrack();
    const trackObjId = trackObj.songId;
    const duration = player.elPlayer.duration * 1000;

    utilsService.deactivateCurrentSong();
    utilsService.activateCurrentSong(trackObjId);

    if (trackObj.songThumbnail === '' || trackObj.songThumbnail === null) {
      trackObj.songThumbnail = 'public/img/song-placeholder.png';
    }

    trackUrl = trackObj.songUrl + '?client_id=' + window.localStorage.scClientId;

    // check rate limit
    utilsService.isPlayable(trackUrl).then(function () {
      that