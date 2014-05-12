'use strict'

app.controller('TracksCtrl', function ($scope, $http) {
    var trackUrl = 'https://api.soundcloud.com/me/tracks?limit=32&oauth_token=' + window.scAccessToken;

    $scope.title = 'Tracks view';
    $scope.display = '';

    $http({method: 'GET', url: trackUrl})
        .success(function(data, status, headers, config) {
            console.log('tracks', data.length)
            if ( data.length === 0 ) {
                $scope.display = false;
            } else {
                $scope.display = true;
            }
        })
        .error(function(data, status, headers, config) {
            console.log('Error getting tracks', status)
        });
});