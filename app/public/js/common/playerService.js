'use strict'
var gui = require('nw.gui');

app.factory('playerService', function($rootScope, $log, $timeout, notificationFactory) {

    $rootScope.isSongPlaying = false;

    /**
     * Responsible to get the current song
     * @return {object} [current song object]
     */
    function getCurrentSong() {
        var el = document.querySelector('.currentSong');

        if ( el !== undefined || el !== null ) {
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
     * @method songClicked
     */
    player.songClicked = function(clickedSong, clickedUrl, clickedThumbnail, clickedTitle, clickedUser) {
        var url, thumbnail, title, user, currentEl;

        currentEl = clickedSong;
        url = clickedUrl;
        thumbnail = clickedThumbnail;
        title = clickedTitle;
        user = clickedUser;

        if ( this.elPlayer.currentTime !== 0 && !this.elPlayer.paused && currentEl === getCurrentSong() ) {
            // song playing is equal to song clicked
            this.pauseSong();
        } else if ( this.elPlayer.currentTime !== 0 && this.elPlayer.paused && currentEl === getCurrentSong() ) {
            // song playing but paused is equal to song clicked
            this.playSong();
        } else if ( this.elPlayer.currentTime === 0 && this.elPlayer.paused || currentEl !== getCurrentSong() ) {
            // there's no song playing
            deactivateCurrentSong();
            $(currentEl).addClass('currentSong');
            this.playNewSong(currentEl, url, thumbnail, title, user);
        }
    };

    /**
     * Responsible to check if there's a song
     * playing if so check if the clicked song
     * is the current song playing and call pause
     * otherwise play song
     * @method playNewSong
     */
    player.playNewSong = function(currentEl, url, thumbnail, title, user) {
        var songNotification;

        if ( thumbnail === '' || thumbnail === null ) {
            thumbnail = 'public/img/logo-short.png';
        }

        this.elPlayer.setAttribute('src', url);
        this.elThumb.setAttribute('src', thumbnail);
        this.elThumb.setAttribute('alt', title);
        this.elTitle.innerHTML = title;
        this.elTitle.setAttribute('title', title);
        this.elUser.innerHTML = user;
        this.elPlayer.play();

        var songNotificationTitle = (title.length > 63 && process.platform == "win32") ? title.substr(0,60) + "..." : title;

        songNotification = new Notification(songNotificationTitle, {
            body: user,
            icon: thumbnail
        });
        songNotification.onclick = function () {
            gui.Window.get().show();
        }

        $rootScope.isSongPlaying = true;
    };

    /**
     * Responsible to play song
     * @method playSong
     */
    player.playSong = function() {
        if ( ! getCurrentSong() ) {
            var $els = $('*[song]')
                , index = Math.floor(Math.random() * $els.length);

            if ( $els[index] !== undefined ) {
                $els[index].click();
            }

        } else {
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
        var $elParent
            , $prevSong
            , $prevListSong
            , $currentSong = $( getCurrentSong() )
            , $isFirstChild = $($currentSong).closest('li').is(':first-child');

        if ( $currentSong.attr('data-play-list') === 'true' ) {

            $elParent = $currentSong.closest('.songList_item');
            $prevSong = $currentSong.closest('.songList_item_songs_list_item').prev().find('*[song]');

            if ( ! $isFirstChild ) {
                $prevSong.click();
            } else {
                $prevListSong = $elParent.prev().find('li:first-child').find('*[song]');
                $prevListSong.click();
            }
        } else {
            $elParent = $currentSong.closest('.songList_item')
            $prevSong = $elParent.prev().find('*[song]');

            if ( ! $isFirstChild ) {
                $prevSong.click();
            }
        }
    };

    /**
     * Responsible to check if there's a song
     * playing if so check the current song and
     * play next song on the list
     * @method playPrevSong
     */
    player.playNextSong = function() {
        var $elParent
            , $nextSong
            , $nextListSong
            , $currentSong = $( getCurrentSong() )
            , $isLastChild = $($currentSong).closest('li').is(':last-child');

        if ( ! getCurrentSong() ) {
            this.playSong();
        } else {
            if ( $currentSong.attr('data-play-list') === 'true' ) {

                $elParent = $currentSong.closest('.songList_item');
                $nextSong = $currentSong.closest('.songList_item_songs_list_item').next().find('*[song]');

                if ( ! $isLastChild ) {
                    $nextSong.click();
                } else {
                    $nextListSong = $elParent.next().find('li:first-child').find('*[song]');
                    $nextListSong.click();
                }
            } else {
                $elParent = $currentSong.closest('.songList_item')
                $nextSong = $elParent.next().find('*[song]');

                if ( ! $isLastChild ) {
                    $nextSong.click();
                }
            }
        }
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

        var rem = parseInt(player.elPlayer.duration - player.elPlayer.currentTime, 10),
            pos = (player.elPlayer.currentTime / player.elPlayer.duration) * 100,
            mins = Math.floor(rem / 60,10),
            secs = rem - mins * 60;

        if ( !isNaN(mins) || !isNaN(secs) ) {
            $(player.elPlayerTimeLeft).text('-' + mins + ':' + (secs > 9 ? secs : '0' + secs));
        }

            mins = Math.floor(player.elPlayer.currentTime / 60,10);
            secs = Math.floor(player.elPlayer.currentTime, 10) - mins * 60;

        if ( !isNaN(mins) || !isNaN(secs) ) {
            $(player.elPlayerTimeCurrent).text(mins + ':' + (secs >= 9 ? secs : '0' + secs));
        }

        var mins = Math.floor(player.elPlayer.duration / 60,10),
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
