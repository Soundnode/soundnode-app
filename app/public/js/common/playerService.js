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

var gui = require('nw.gui');

app.factory('playerService', function($rootScope, $log, $timeout, $window, $state, notificationFactory, queueService) {

    $rootScope.isSongPlaying = false;
    $rootScope.isPlaylistPlaying = false;
    $rootScope.oldView = $state.current.name;

    /**
     * Get siblings of current song
     * @params clickedSong [track DOM element]
     * @returns array [sibling of ]
     */
    function getSongSiblingsData(clickedSong) {
        var elCurrentSongParent = $(clickedSong).closest('li');
        var elCurrentSongSiblings = $(elCurrentSongParent).nextAll('li');
        var elCurrentSongSiblingData;
        var list = [];

        for ( var i = 0; i < elCurrentSongSiblings.length; i++ ) {
            elCurrentSongSiblingData = $(elCurrentSongSiblings[i]).find('.songList_item_song_button').data();
            list.push(elCurrentSongSiblingData);
        }

        return list;
    }

    /**
     * Responsible to get the current song
     * @return {object} [current song object]
     */
    function getCurrentSong() {
        var el = document.querySelector('.currentSong');

        if ( el ) {
            return el;
        } else {
            return false;
        }
    }

    /**
     * Responsible to deactivate current song
     * (remove class "currentSong" from element)
     */
    function deactivateCurrentSong() {
        var currentSong = getCurrentSong();
        $(currentSong).removeClass('currentSong');
    }

    function activateCurrentSong(track) {
        var el = $('span[data-song-id="' + track);
        $(el).addClass('currentSong');
    }

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
    player.elPlayerTimeLeft = document.getElementById('player-timeleft');
    player.elPlayerDuration = document.getElementById('player-duration');
    player.elPlayerTimeCurrent = document.getElementById('player-timecurrent');
    player.elThumb = document.getElementById('playerThumb');
    player.elTitle = document.getElementById('playerTitle');
    player.elUser = document.getElementById('playerUser');

    /**
     * Adjust player volume
     * @param value [volume level]
     * @method volume
     */
    player.volume = function(value) {
        if (typeof value === "undefined") {
            return player.elPlayer.volume;
        }
        if (value >= 0 && value <= 1) {
            player.elPlayer.volume = parseFloat(value).toFixed(1);
            window.localStorage.volume = parseFloat(value).toFixed(1);
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
    player.songClicked = function(clickedSong) {
        var currentElSiblings;
        var trackPosition;
        var currentElData = $(clickedSong).data();

        if ( $state.current.name !== $rootScope.oldView ) {
            queueService.clear();
        }

        if ( this.elPlayer.currentTime !== 0 && !this.elPlayer.paused && clickedSong === getCurrentSong() ) { // song playing is equal to song clicked
            this.pauseSong();
        } else if ( this.elPlayer.currentTime !== 0 && this.elPlayer.paused && clickedSong === getCurrentSong() ) { // song playing but paused is equal to song clicked
            this.playSong();
        } else if ( this.elPlayer.currentTime === 0 && this.elPlayer.paused || clickedSong !== getCurrentSong() ) { // there's no song playing or song clicked not equal to current song paying

            if ( queueService.isEmpty() ) {
                currentElSiblings = getSongSiblingsData(clickedSong);
                queueService.insert(currentElData);
                queueService.push(currentElSiblings);
            } else { // Queue is not empty

                // find track in the Queue
                trackPosition = queueService.find(currentElData.songId);
                if ( trackPosition ) {
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
    player.playNewSong = function() {
        var trackObj = queueService.getTrack();
        var trackObjId = trackObj.songId;
        var songNotification;

        deactivateCurrentSong();
        activateCurrentSong(trackObjId);

        if ( trackObj.songThumbnail === '' || trackObj.songThumbnail === null ) {
            trackObj.songThumbnail = 'public/img/logo-short.png';
        }

        this.elPlayer.setAttribute('src', trackObj.songUrl + '?client_id=' + $window.scClientId);
        this.elThumb.setAttribute('src', trackObj.songThumbnail);
        this.elThumb.setAttribute('alt', trackObj.songTitle);
        this.elTitle.innerHTML = trackObj.songTitle;
        this.elTitle.setAttribute('title', trackObj.songTitle);
        this.elUser.innerHTML = trackObj.songUser;
        this.elPlayer.play();

        var songNotificationTitle = (trackObj.songTitle.length > 63 && process.platform == "win32") ? trackObj.songTitle.substr(0,60) + "..." : trackObj.songTitle;

        songNotification = new Notification(songNotificationTitle, {
            body: trackObj.songUser,
            icon: trackObj.songThumbnail
        });
        songNotification.onclick = function () {
            gui.Window.get().show();
        };

        $rootScope.isSongPlaying = true;
    };

    /**
     * Responsible to play song
     * @method playSong
     */
    player.playSong = function() {
        if ( getCurrentSong() ) {
            this.elPlayer.play();
            $rootScope.isSongPlaying = true;
        }
    };

    /**
     * Responsible to pause song
     * @method pauseSong
     */
    player.pauseSong = function() {
        this.elPlayer.pause();
        $rootScope.isSongPlaying = false;
    };

    /**
     * Responsible to check if there's a song
     * playing if so check the current song and
     * play previous song on the list
     * @method playPrevSong
     */
    player.playPrevSong = function() {
        queueService.prev();
        this.playNewSong();
    };

    /**
     * Responsible to check if there's a song
     * playing if so check the current song and
     * play next song on the list
     * @method playPrevSong
     */
    player.playNextSong = function() {
        queueService.next();
        this.playNewSong();
    };

    /**
     * Add event listener "on ended" to player
     */
    $(player.elPlayer).off().on('ended', function() {
        $rootScope.isSongPlaying = false;
        player.playNextSong();
    });

    /**
     * Add event listener "time update" to song bar progress
     * and song timer progress
     */
    $(player.elPlayer).bind('timeupdate', function() {

        var rem = parseInt(player.elPlayer.duration - player.elPlayer.currentTime, 10);
        var pos = (player.elPlayer.currentTime / player.elPlayer.duration) * 100
        var mins = Math.floor(rem / 60,10);
        var secs = rem - mins * 60;

        if ( !isNaN(mins) || !isNaN(secs) ) {
            $(player.elPlayerTimeLeft).text('-' + mins + ':' + (secs > 9 ? secs : '0' + secs));
        }

        mins = Math.floor(player.elPlayer.currentTime / 60,10);
        secs = Math.floor(player.elPlayer.currentTime, 10) - mins * 60;

        if ( !isNaN(mins) || !isNaN(secs) ) {
            $(player.elPlayerTimeCurrent).text(mins + ':' + (secs >= 9 ? secs : '0' + secs));
        }

        mins = Math.floor(player.elPlayer.duration / 60,10);
        secs = Math.floor(player.elPlayer.duration, 10) - mins * 60;

        if ( !isNaN(mins) || !isNaN(secs) ) {
            $(player.elPlayerDuration).text(mins + ':' + (secs > 9 ? secs : '0' + secs));
        }

        $(player.elPlayerProgress).css({
            width: pos + '%'
        });

    });

    /**
     * Responsible to add scrubbing
     * drag or click scrub on track progress bar
     */
    var scrub = $(player.elPlayerProgress).parent().off();

    function scrubTimeTrack(e, el) {
        var percent = ( e.offsetX / $(el).width() );
        var duration = player.elPlayer.duration;
        var seek = percent * duration;

        if ( player.elPlayer.networkState === 0 || player.elPlayer.networkState === 3 ) {
            notificationFactory.error("Something went wrong. I can't play this track :(");
        }

        if ( player.elPlayer.readyState > 0 ) {
            player.elPlayer.currentTime = parseInt(seek, 10)
        }
    }

    scrub.on('click', function(e) {
        var el = this;
        scrubTimeTrack(e, el);
    });

    scrub.on('mousedown', function (e) {
        scrub.on('mousemove', function (e) {
            var el = this;
            scrubTimeTrack(e, el);
        });
    });

    scrub.on('mouseup', function (e) {
        scrub.unbind('mousemove');
    });

    scrub.on('dragstart', function (e) {
        e.preventDefault();
    });

    return player;
});
