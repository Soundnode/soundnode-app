app.factory('playerService', function($rootScope) {

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
            console.warn('Something went wrong trying to get current song');
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
     * Player element
     */
    player.elPlayer = document.getElementById('player');
    player.elPlayerProgress = document.getElementById('player-progress');
    player.elPlayerTimeLeft = document.getElementById('player-timeleft');
    player.elThumb = document.getElementById('playerThumb');
    player.elTitle = document.getElementById('playerTitle');
    player.elUser = document.getElementById('playerUser');

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
        this.elPlayer.setAttribute('src', url);
        this.elThumb.setAttribute('src', thumbnail);
        this.elThumb.setAttribute('alt', title);
        this.elTitle.innerHTML = title;
        this.elTitle.setAttribute('title', title);
        this.elUser.innerHTML = user;
        this.elPlayer.play();

        $rootScope.isSongPlaying = true;
    };

    /**
     * Responsible to play song
     * @method playSong
     */
    player.playSong = function() {
        if ( document.querySelector('.currentSong') === null ) {
            var $els = $('*[song]')
                , index = Math.floor(Math.random() * $els.length);

            $els[index].click();
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

            $elParent = $currentSong.closest('.songList_item_songs_list_item');
            $prevSong = $currentSong.closest('.songList_item_songs_list_item').prev().find('*[song]');

            if ( ! $isLastChild ) {
                $prevSong.click();
            } else {
                $prevListSong = $currentSong.closest('.songList_item_songs_list').prev().find('li:first-child').find('*[song]');

                if ( ! $isFirstChild ) {
                    $prevListSong.click();
                }
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

        if ( $currentSong.attr('data-play-list') === 'true' ) {

            $elParent = $currentSong.closest('.songList_item_songs_list_item');
            $nextSong = $currentSong.closest('.songList_item_songs_list_item').next().find('*[song]');

            if ( ! $isLastChild ) {
                $nextSong.click();
            } else {
                $nextListSong = $currentSong.closest('.songList_item_songs_list').next().find('li:first-child').find('*[song]');

                if ( ! $isLastChild ) {
                    $nextListSong.click();
                }
            }
        } else {
            $elParent = $currentSong.closest('.songList_item')
            $nextSong = $elParent.next().find('*[song]');

            if ( ! $isLastChild ) {
                $nextSong.click();
            }
        }
    };

    /**
     * Responsible to turn the volume up
     * @method volumeUp
     */
    player.volumeUp = function() {
        if ( this.elPlayer.volume < 1 ) {
            this.elPlayer.volume += .1;
        }
    }

    /**
     * Responsible to turn the volume down
     * @method volumeDown
     */
    player.volumeDown = function() {
        if ( this.elPlayer.volume > 0 ) {
            this.elPlayer.volume -= .1;
        }
    }

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

        $(player.elPlayerProgress).css({
            width: pos + '%'
        });

    });

    return player;
});