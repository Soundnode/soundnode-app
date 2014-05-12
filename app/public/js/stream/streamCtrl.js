'use strict'

app.controller('StreamCtrl', function ($scope, $http) {
    var streamURL = 'https://api.soundcloud.com/me/activities?limit=32&oauth_token=' + window.scAccessToken;

    $scope.title = 'Stream';
    $scope.data = '';

    $http({method: 'GET', url: streamURL})
        .success(function(data, status, headers, config) {
            console.log('stream', data)
            $scope.data = data.collection;
        })
        .error(function(data, status, headers, config) {
            console.log('Error getting stream', status)
        });

});