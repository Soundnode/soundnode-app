'use strict';

app.controller('QueueCtrl', function(
    $scope,
    $rootScope,
    queueService,
    $log, $timeout,
    playerService,
    SCapiService,
    ngDialog,
    notificationFactory,
    $location,
    $anchorScroll,
    utilsService
) {
    $scope.data = queueService.getAll();

    $scope.$on('activateQueue', function(event, data) {
        $scope.activateTrackInQueue();
    });

    // Listen to DOM mutation and react
    function addDOMmutationListener() {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var list = document.querySelector('.queueListView_list');

        var observer = new MutationObserver(function(mutations) {
            $scope.activateTrackInQueue();
        });

        observer.observe(list, {
            childList: true
        });
    }

    // quick hack to add DOM mutation listener
    // time to wait until page is fully loaded
    $timeout(function() {
        addDOMmutationListener();
    }, 1000);

    $scope.activateTrackInQueue = function($event) {
        if ( $scope.data.length < 1 ) {
            return;
        }

        var trackId = queueService.getTrack().songId;
        var track = document.querySelector('.queueListView_list_item[data-song-id="' + trackId + '"]');
        var oldActive = document.querySelector('.queueListView_list_item.active');

        if ( oldActive ) {
            oldActive.classList.remove('active');
        }

        if ( track ) {
            track.classList.add('active');
        }
    };

    /**
     * remove track from the queue
     * @param $event
     */
    $scope.remove = function($event) {
        var trackData = $($event.target).closest('.queueListView_list_item').data();
        var trackPosition = queueService.find(trackData.songId);

        queueService.remove(trackPosition);
        playerService.playNewSong();
    };

    /**
     * like track from the queue
     * @param $event
     */
    $scope.like = function($event) {
        var trackData = $($event.target).closest('.queueListView_list_item').data();
        var userId = $rootScope.userId;
        var songId = trackData.songId;

        SCapiService.saveFavorite(userId, songId)
            .then(function(status) {
                if ( typeof status == "object" ) {
                    notificationFactory.success("Song added to likes!");
                    utilsService.markTrackAsFavorite(songId);
                    $rootScope.$broadcast("track::favorited", songId);
                }
            }, function(status) {
                notificationFactory.error("Something went wrong!");
            });
    };

    /**
     * repost track from queue
     * @param  {object} $event - Angular event
     * @return {promise}
     */
    $scope.repost = function ($event) {
        var trackData = $($event.target).closest('.queueListView_list_item').data();
        var songId = trackData.songId;

        return SCapiService.createRepost(songId)
            .then(function (status) {
                if (angular.isObject(status)) {
                    notificationFactory.success('Song added to reposts!');
                    utilsService.markTrackAsReposted(songId);
                }
            })
            .catch(function (status) {
                notificationFactory.error('Something went wrong!');
            });
    };

    /**
     * add track to playlist
     * @param $event
     */
    $scope.addToPlaylist = function($event) {
        var trackData = $($event.target).closest('.queueListView_list_item').data();

        $scope.playlistSongId = trackData.songId;
        $scope.playlistSongName = trackData.songTitle;

        ngDialog.open({
            showClose: false,
            scope: $scope,
            controller: 'PlaylistDashboardCtrl',
            template: 'views/playlists/playlistDashboard.html'
        });
    };

    /**
     * scroll view to track
     * @param $event
     */
    $scope.gotoTrack = function($event) {
        var trackData = $($event.target).closest('.queueListView_list_item').data();
        var trackId = trackData.songId;

        $location.hash(trackId);
        $anchorScroll();
    };

    /**
     * Dynamically change position of menu not to overlap fixed footer and header
     * @param  {object} $event - Angular event
     */
    $scope.menuPosition = function ($event) {
        var $hover = $($event.target);
        var $menu = $hover.find('.queueListView_list_item_options_list');
        var $arrow = $hover.find('.queueListView_list_item_options_arrow');

        var menuHeight = $menu.height();
        var arrowHeight = $arrow.outerHeight();
        var headerHeight = $('.topFrame').outerHeight();
        var footerHeight = $('.player_inner').outerHeight();
        var hoverHeight = $hover.outerHeight();

        // Calculate top and bottom edge position and compare it with current
        var borderTop = headerHeight;
        var borderBottom = window.innerHeight - footerHeight;
        var hoverTop = $hover.offset().top;

        // Arrow in the middle by default
        var newTop = -menuHeight / 2 + arrowHeight / 2;

        // If overlapping top border - move list to the bottom
        if (hoverTop - menuHeight / 2 < borderTop) {
            newTop = -arrowHeight;
        // If overlapping bottom border - move list to the top
        } else if (hoverTop + hoverHeight + menuHeight / 2 > borderBottom) {
            newTop = -menuHeight + arrowHeight;
        }

        $menu.css({ top: newTop });
    };

});