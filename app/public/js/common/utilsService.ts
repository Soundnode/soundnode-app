'use strict';

app.factory('utilsService', function (
  queueService,
  SCapiService,
  $q,
  $rootScope,
  $timeout,
  modalFactory
) {
  /**
   * API (helpers/utils) to interact with the UI
   * and the rest of the App
   * @type {{}}
   */
  const Utils = {
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
  Utils.markTrackAsFavorite = function (trackId) {
    const track = document.querySelector('a[favorite-song][data-song-id="' + trackId + '"]');
    track.classList.add('liked');
    //track.setAttribute('favorite', true);
  };

  /**
   * Find track and mark as reposted
   * @param trackId (track id)
   * @method markTrackAsReposted
   */
  Utils.markTrackAsReposted = function (trackId) {
    const track = document.querySelector('a[reposted-song][data-song-id="' + trackId + '"]');
    track.classList.add('reposted');
  };

  /**
   * Activate track in view based on trackId
   * @param trackId [contain track id]
   */
  Utils.activateCurrentSong = function (trackId) {
    const el = document.querySelector('span[data-song-id="' + trackId + '"]');

    if (el) {
      el.classList.add('currentSong');
    }
  };

  /**
   * Responsible to deactivate current song
   * (remove class "currentSong" from element)
   */
  Utils.deactivateCurrentSong = function () {
    const currentSong = this.getCurrentSong();

    if (currentSong) {
      currentSong.classList.remove('currentSong');
    }
  };

  /**
   * Responsible to get the current song
   * @return {object} [current song object]
   */
  Utils.getCurrentSong = function () {
    return document.querySelector('.currentSong');
  };

  /**
   * Get a number between min index and max index
   * in the Queue array
   * @returns {number} [index in array]
   */
  Utils.shuffle = function () {
    const max = queueService.size() - 1;
    const min = 0;

    queueService.currentPosition = Math.floor(Math.random() * (max - min) + min);
  };

  /**
   * Get siblings of current song
   * @params clickedSong [track DOM element]
   * @returns array [sibling of ]
   */
  Utils.getSongSiblingsData = function (clickedSong) {
    const elCurrentSongParent = $(clickedSong).closest('li');
    const elCurrentSongSiblings = $(elCurrentSongParent).nextAll('li');
    let elCurrentSongSiblingData;
    const list = [];

    for (let i = 0; i < elCurrentSongSiblings.length; i++) {
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
    let fetchLikedIds;

    if ( fromCache ) {
      fetchLikedIds = $q(function(resolve) {
        resolve(Utils.likesIds)
      });
    } else {
      fetchLikedIds = SCapiService.getFavoritesIds()
    }

    return fetchLikedIds.then(function (ids) {
      if (!fromCache) {
        Utils.likesIds = ids;
      }
      collection.forEach(function (item) {
        const track = item.track || item;
        const id = track.id || track.songId;
        // modify each track by reference
        track.user_favorite = Utils.likesIds.indexOf(id) > -1;
      });
      return collection;
    });
  };

  /**
   * When manipulating likes after a page is loaded, it's necessary to
   * manipulate the likesIds cache when you modify user_favorite like
   * above. Used to sync the likes between player and everything else
   * @param  {number or string} id - the song id to add to likes
   */
  Utils.addCachedFavorite = function (id) {
    id = parseInt(id);
    const index = Utils.likesIds.indexOf(id);
    if (index == -1) {
      Utils.likesIds.push(id);
    }
  }

  /**
   * When manipulating likes after a page is loaded, it's necessary to
   * manipulate the likesIds cache when you modify user_favorite like
   * above. Used to sync the likes between player and everything else
   * @param  {number or string} id - the song id to remove from likes
   */
  Utils.removeCachedFavorite = function (id) {
    id = parseInt(id);
    const index = Utils.likesIds.indexOf(id);
    if (index > -1) {
      Utils.likesIds.splice(index, 1);
    }
  }

  /**
   * Fetch ids of reposted tracks and apply them to existing collection
   * @param  {array} collection - stream collection or tracks array
   * @param  {boolean} fromCache  - if should make request to API
   * @return {promise}            - promise with original collection
   */
  Utils.updateTracksReposts = function (collection, fromCache) {
    const fetchRepostsIds = fromCache ?
      $q(function (resolve) { resolve(Utils.repostsIds) }) :
      SCapiService.getRepostsIds();
    return fetchRepostsIds.then(function (ids) {
      if (!fromCache) {
        Utils.repostsIds = ids;
      }
      collection.forEach(function (item) {
        const track = item.track || item;
        // modify each track by reference
        track.user_reposted = Utils.repostsIds.indexOf(track.id) > -1;
      });
      return collection;
    });
  };

  /**
   * Check if current track position is last
   * @returns {boolean}
   */
  Utils.isLastTrackInQueue = function () {
    return queueService.currentPosition === queueService.size() - 1;
  };

  /**
   * Scroll main view to bottom
   */
  Utils.scrollToBottom = function () {
    const $mainView = document.querySelector('.mainView');
    $mainView.scrollTop = $mainView.scrollHeight;
  };

  /**
   * Watch for changes on "isLoading" state
   * and once that happened click the next tracks
   * to last track (not in Queue) to Queue
   */
  Utils.addLoadedTracks = function () {
    const that = this;

    $rootScope.$watch('isLoading', function (newVal, oldVal) {
      if (oldVal) {
        $timeout(function () {
          const currentSong = that.getCurrentSong();

          $(currentSong)
            .closest('li')
            .next()
            .find('.songList_item_song_button')
            .click();
        }, 0)
      }
    });
  };

  /**
   * Find current track playing and set as "currentSong"
   */
  Utils.setCurrent = function () {
    const $track = queueService.getTrack();

    if ($track !== null && $track != undefined) {
      $timeout(function () {
        $('#' + $track.songId).addClass('currentSong');
      }, 1500);
    }

  };

  Utils.isPlayable = function (trackUrl) {
    return SCapiService.checkRateLimit(trackUrl);
  }

  return Utils;

});