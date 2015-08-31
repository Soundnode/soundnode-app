'use strict';

app.controller('QueueCtrl', function($scope, $rootScope, queueService, $log) {
    $scope.title = 'Queue';
    $scope.data = queueService.getAll();

    $scope.toggleView = function($event) {

        console.log('called', $scope.data);
    }
});