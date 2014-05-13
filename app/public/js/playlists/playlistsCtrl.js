'use strict';

app.controller('PlaylistsCtrl', function ($scope, $http) {
    var streamURL = 'https://api.soundcloud.com/me/playlists?limit=32&oauth_token=' + window.scAccessToken;

    $scope.title = 'Playlists';
    $scope.display = false;
    $scope.data = '';

    $http({method: 'GET', url: streamURL})
        .success(function(data, status, headers, config) {
            console.log('Playlists', data);
            $scope.data = data;

            if ( data.length === 0 ) {
                $scope.display = false;
            } else {
                $scope.display = true;
            }
        })
        .error(function(data, status, headers, config) {
            console.log('Error getting stream', status)
        });

    $scope.checkForPlaceholder = function (thumb) {
        var newSize;

        if ( thumb === null ) {
            return 'public/img/temp-playing.png';
        } else {
            newSize = thumb.replace('large', 'badge');
            return newSize;
        }
    }
});