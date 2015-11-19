'use strict';

app.factory('utilsService', function(
    queueService,
    SCapiService,
    $q
) {
    /**
     * API (helpers/utils) to interact with the UI
     * and the rest of the App
     * @type {{}}
     */
    var Utils = {
        /**
         * Store cache of fetched likes ids
         * @type {Array}
         */
        likesIds: [],
        /**
         * Store cache of fetched reposts ids
         * @type {Array}
         */
        repostsIds: []
    };

    /**
     * Find track and mark as favorited
     * @param trackId (track id)
     * @method markTrackAsFavorite
     */
    Utils.markTrackAsFavorite = function(trackId) {
        var track = document.querySelector('a[favorite-song][data-song-id="' + trackId + '"]');
        track.classList.add('liked');
        //track.setAttribute('favorite', true);
    };

    /**
     * Find track and mark as reposted
     * @param trackId (track id)
     * @method markTrackAsReposted
     */
    Utils.markTrackAsReposted = function(trackId) {
        var track = document.querySelector('a[reposted-song][data-song-id="' + trackId + '"]');
        track.classList.add('reposted');
    };

    /**
     * Activate track in view based on trackId
     * @param trackId [contain track id]
     */
    Utils.activateCurrentSong = function(trackId) {
        var el = document.querySelector('span[data-song-id="' + trackId + '"]');

        if ( el ) {
            el.classList.add('currentSong');
        }
    };

    /**
     * Responsible to deactivate current song
     * (remove class "currentSong" from element)
     */
    Utils.deactivateCurrentSong = function() {
        var currentSong = this.getCurrentSong();

        if ( currentSong ) {
            currentSong.classList.remove('currentSong');
        }
    };

    /**
     * Responsible to get the current song
     * @return {object} [current song object]
     */
    Utils.getCurrentSong = function() {
        return document.querySelector('.currentSong');
    };

    /**
     * Get a number between min index and max index
     * in the Queue array
     * @returns {number} [index in array]
     */
    Utils.shuffle = function() {
        var max = queueService.size() - 1;
        var min = 0;

        queueService.currentPosition = Math.floor(Math.random() * (max - min) + min);
    };

    /**
     * Get siblings of current song
     * @params clickedSong [track DOM element]
     * @returns array [sibling of ]
     */
    Utils.getSongSiblingsData = function(clickedSong) {
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

    /**
     * Fetch ids of liked tracks and apply them to existing collection
     * @param  {array} collection - stream collection or tracks array
     * @param  {boolean} fromCache  - if should make request to API
     * @return {promise}            - promise with original collection
     */
    Utils.updateTracksLikes = function (collection, fromCache) {
        var fetchLikedIds = fromCache ?
            $q(function (resolve) { resolve(Utils.likesIds) }) :
            SCapiService.getFavoritesIds();
        return fetchLikedIds.then(function (ids) {
            if (!fromCache) {
                Utils.likesIds = ids;
            }
            collection.forEach(function (item) {
                var track = item.track || item;
                // modify each track by reference
                track.user_favorite = Utils.likesIds.indexOf(track.id) > -1;
            });
            return collection;
        });
    };

    /**
     * Fetch ids of reposted tracks and apply them to existing collection
     * @param  {array} collection - stream collection or tracks array
     * @param  {boolean} fromCache  - if should make request to API
     * @return {promise}            - promise with original collection
     */
    Utils.updateTracksReposts = function (collection, fromCache) {
        var fetchRepostsIds = fromCache ?
            $q(function (resolve) { resolve(Utils.repostsIds) }) :
            SCapiService.getRepostsIds();
        return fetchRepostsIds.then(function (ids) {
            if (!fromCache) {
                Utils.repostsIds = ids;
            }
            collection.forEach(function (item) {
                var track = item.track || item;
                // modify each track by reference
                track.user_reposted = Utils.repostsIds.indexOf(track.id) > -1;
            });
            return collection;
        });
    };

    return Utils;

});