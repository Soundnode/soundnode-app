'use strict';

app.controller('QueueCtrl', function(
    $scope: ng.IScope,
    $rootScope: ng.IRootScopeService,
    queueService: any,
    $log: ng.ILogService,
    $timeout: ng.ITimeoutService,
    playerService: any,
    SCapiService: any,
    ngDialog: any,
    notificationFactory: any,
    $location: ng.ILocationService,
    $anchorScroll: ng.IAnchorScrollService,
    utilsService: any
) {
    $scope.data = queueService.getAll();

    $scope.$on('activateQueue', function(event: ng.IAngularEvent, data: any) {
        $scope.activateTrackInQueue();
    });

    // Listen to DOM mutation and react
    function addDOMmutationListener() {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        const list = document.querySelector('.queueListView_list');

        const observer = new MutationObserver(function(mutations) {
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

    $scope.activateTrackInQueue = function($event: ng.IAngularEvent) {
        if ($scope.data.length < 1) {
            return;
        }

        const trackId = queueService.getTrack().songId;
        const track = document.querySelector('.queueListView_list_item[data-song-id="' + trackId + '"]');
        const oldActive = document.querySelector('.queueListView_list_item.active');

        if (oldActive) {
            oldActive.classList.remove('active');
        }

        if (track) {
            track.classList.add('active');
        }
    };

    /**
     * remove track from the queue
     * @param $event
     */
    $scope.remove = function($event: ng.IAngularEvent) {
        const trackData = $($event.target).closest('.queueListView_list_item').data();
        const trackPosition = queueService.find(trackData.songId);

        queueService.remove(trackPosition);
        playerService.playNewSong();
    };

    /**
     * like track from the queue
     * @param $event
     */
    $scope.like = function($event: ng.IAngularEvent) {
        const trackData = $($event.target).closest('.queueListView_list_item').data();
        const userId = $rootScope.userId;
        const songId = trackData.songId;

        SCapiService.saveFavorite(userId, songId)
            .then(function(status: any) {
                if (typeof status == "object") {
                    notificationFactory.success("Song added to likes!");
                    utilsService.markTrackAsFavorite(songId);
                    $rootScope.$broadcast("track::favorited", songId);
                }
            }, function(status: any) {
                notificationFactory.error("Something went wrong!");
            });
    };

    /**
     * repost track from queue
     * @param  {object} $event - Angular event
     * @return {promise}
     */
    $scope.repost = function ($event: ng.IAngularEvent) {
        const trackData = $($event.target).closest('.queueListView_list_item').data();
        const songId = trackData.songId;

        return SCapiService.createRepost(songId)
            .then(function (status: any) {
                if (angular.isObject(status)) {
                    notificationFactory.success('Song added to reposts!');
                    utilsService.markTrackAsReposted(songId);
                }
            })
            .catch(function (status: any) {
                notificationFactory.error('Something went wrong!');
            });
    };

    /**
     * add track to playlist
     * @param $event
     */
    $scope.addToPlaylist = function($event: ng.IAngularEvent) {
        const trackData = $($event.target).closest('.queueListView_list_item').data();

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
    $scope.gotoTrack = function($event: ng.IAngularEvent) {
        const trackData = $($event.target).closest('.queueListView_list_item').data();
        const trackId = trackData.songId;

        $location.hash(trackId);
        $anchorScroll();
    };

    /**
     * Dynamically change position of menu not to overlap fixed footer and header
     * @param  {object} $event - Angular event
     */
    $scope.menuPosition = function ($event: ng.IAngularEvent) {
        const $hover = $($event.target);
        const $menu = $hover.find('.queueListView_list_item_options_list');
        const $arrow = $hover.find('.queueListView_list_item_options_arrow');

        const menuHeight = $menu.height();
        const arrowHeight = $arrow.outerHeight();
        const headerHeight = $('.topFrame').outerHeight();
        const footerHeight = $('.player_inner').outerHeight();
        const hoverHeight = $hover.outerHeight();

        // Calculate top and bottom edge position and compare it with current
        const borderTop = headerHeight;
        const borderBottom = window.innerHeight - footerHeight;
        const hoverTop = $hover.offset().top;

        // Arrow in the middle by default
        let newTop = -menuHeight / 2 + arrowHeight / 2;

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