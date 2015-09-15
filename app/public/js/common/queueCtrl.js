'use strict';

app.controller('QueueCtrl', function($scope, $rootScope, queueService, $log, $timeout) {
    $scope.data = queueService.getAll();

    $scope.$on('activateQueue', function(event, data) {
        $scope.activateTrackInQueue();
    });

    // Listen to DOM mutation and react
    function addDOMmutationListener() {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var list = document.querySelector('.queueListView_list');

        var observer = new MutationObserver(function(mutations) {
            $log.log('mutation done', mutations);
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

    $scope.activateTrackInQueue = function() {

        console.log('called activate track ');

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
        $log.log('remove called')
    };

    /**
     * like track from the queue
     * @param $event
     */
    $scope.like = function($event) {
        $log.log('like called')
    };

    /**
     * add track to playlist
     * @param $event
     */
    $scope.addToPlaylist = function($event) {
        $log.log('add to playlist called')
    };

    /**
     * scroll view to current track playing
     * @param $event
     */
    $scope.gotoTrack = function($event) {
        $log.log('gotoTrack called')
    }

});