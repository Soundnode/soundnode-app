'use strict';

app.controller('searchCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.title = 'Search result';

    $scope.onSubmit = function (keyword) {
        var searchUrl = 'http://api.soundcloud.com/tracks?limit=32&q=' + keyword + '&client_id=' + window.scClientId;

        $http({method: 'GET', url: searchUrl})
            .success(function(data, status, headers, config) {
                console.log('search', data)

            })
            .error(function(data, status, headers, config) {
                console.log('Error getting stream', status)
            });
    }
}]);