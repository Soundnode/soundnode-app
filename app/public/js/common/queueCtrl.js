'use strict';

app.controller('QueueCtrl', function($scope, $rootScope, queueService, $log) {
    $scope.data = queueService.getAll();

    $scope.toggleView = function($event) {

        if ( $scope.data.length < 1 ) {
            return;
        }

        $event.currentTarget.classList.toggle('active');
        document.querySelector('.queueList').classList.toggle('active');
    }
});