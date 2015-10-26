'use strict';

app.factory('utilsService', function(
    queueService
) {
    /**
     * API (helpers/utils) to interact with the UI
     * and the rest of the App
     * @type {{}}
     */
    var utils = {};

    /**
     * Find track and mark as favorited
     * @param trackId (track id)
     * @method markTrackAsFav
     */
    utils.markTrackAsFavorite = function(trackId) {
        var track = document.querySelector('a[data-song-id="' + trackId + '"]');
        track.classList.add('liked');
    };

    /**
     * Activate track in view based on trackId
     * @param trackId [contain track id]
     */
    utils.activateCurrentSong = function(trackId) {
        var el = document.querySelector('span[data-song-id="' + trackId + '"]');

        if ( el ) {
            el.classList.add('currentSong');
        }
    };

    /**
     * Responsible to deactivate current song
     * (remove class "currentSong" from element)
     */
    utils.deactivateCurrentSong = function() {
        var currentSong = this.getCurrentSong();

        if ( currentSong ) {
            currentSong.classList.remove('currentSong');
        }
    };

    /**
     * Responsible to get the current song
     * @return {object} [current song object]
     */
    utils.getCurrentSong = function() {
        return document.querySelector('.currentSong');
    };

    /**
     * Get a number between min index and max index
     * in the Queue array
     * @returns {number} [index in array]
     */
    utils.shuffle = function() {
        var max = queueService.size() - 1;
        var min = 0;

        queueService.currentPosition = Math.floor(Math.random() * (max - min) + min);
    };

    /**
     * Get siblings of current song
     * @params clickedSong [track DOM element]
     * @returns array [sibling of ]
     */
    utils.getSongSiblingsData = function(clickedSong) {
        var elCurrentSongParent = $(clickedSong).closest('li');
        var elCurrentSongSiblings = $(elCurrentSongParent).nextAll('li');
        var elCurrentSongSiblingData;
        var list = [];

        for ( var i = 0; i < elCurrentSongSiblings.length; i++ ) {
            elCurrentSongSiblingData = $(elCurrentSongSiblings[i]).find('.songList_item_song_button').data();
            list.push(elCurrentSongSiblingData);
        }

        return list;
    };


    return utils;

});