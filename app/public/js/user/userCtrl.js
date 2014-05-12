'use strict'

app.controller('UserCtrl', function ($scope, $http) {
    var userURL = 'https://api.soundcloud.com/me.json?oauth_token=' + window.scAccessToken;

    $scope.name = '';
    $scope.userThumb = '';
    $scope.userThumbWidth = '50px';
    $scope.userThumbHeight = '50px';

    $http({method: 'GET', url: userURL})
        .success(function(data, status, headers, config) {
            console.log('user', data.username)
            $scope.name = data.username;
            $scope.userThumb = data.avatar_url;
        })
        .error(function(data, status, headers, config) {
            console.log('Error getting user', status)
        });

    $scope.logOut = function() {
        SC.disconnect();
        console.log( SC.isConnected() );
    }
    
});