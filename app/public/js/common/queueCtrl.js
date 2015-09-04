'use strict';

app.controller('QueueCtrl', function($scope, $rootScope, queueService, $log) {
    $scope.data = queueService.getAll();

    $scope.$on('activateQueue', function(event, data) {
        $scope.activateTrackInQueue();
    });

    $scope.activateTrackInQueue = function() {

        if ( $scope.data.length < 1 ) {
            return;
        }

        var trackId = queueService.getTrack().songId;
        var track = document.querySelector('.queueListView_list_item[data-song-id="' + trackId + '"]');
        var oldActive = document.querySelector('.queueListView_list_item.active');

        if ( oldActive ) {
            oldActive.classList.remove('active');
        }

        track.classList.add('active');
    };


    $scope.toggleQueue = function($event) {

        if ( $scope.data.length < 1 ) {
            return;
        }

        $event.currentTarget.classList.toggle('active');
        document.querySelector('.queueList').classList.toggle('active');

        $scope.activateTrackInQueue();
    }
});