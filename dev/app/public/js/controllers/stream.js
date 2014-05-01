'use strict'

app.controller('StreamCtrl', ['$scope', '$http', function ($scope, $http) {
    
    var streamURL = 'https://api.soundcloud.com/me/activities?limit=10&oauth_token=' + window.scAccessToken;

    $http({method: 'GET', url: streamURL})
        .success(function(data, status, headers, config) {
            console.log('stream', data)
        })
        .error(function(data, status, headers, config) {
            console.log('Error getting stream', status)
        });

    $scope.title = 'Stream view';
}])