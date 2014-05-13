'use strict'

app.controller('FavoritesCtrl', function ($scope, $http) {
    var streamURL = 'https://api.soundcloud.com/me/favorites.json?oauth_token=' + window.scAccessToken;

    $scope.title = 'Favorites'
    $scope.data = '';

    $http({method: 'GET', url: streamURL})
        .success(function(data, status, headers, config) {
            console.log('Likes', data)
            $scope.data = data

        })
        .error(function(data, status, headers, config) {
            console.log('Error getting stream', status)
        });

});