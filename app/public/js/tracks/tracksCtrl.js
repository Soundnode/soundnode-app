'use strict'

app.controller('TracksCtrl', function ($scope, SCapiService) {
    var endpoint = 'tracks'
        , params = 'limit=32';

    $scope.title = 'Tracks';
    $scope.data = '';

    SCapiService.get(endpoint, params)
                .then(function(data) {
                    $scope.data = data;
                }, function(error) {
                    console.log('error', error);
                });
});