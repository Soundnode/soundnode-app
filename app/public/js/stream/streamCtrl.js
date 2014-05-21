'use strict'

app.controller('StreamCtrl', function ($scope, SCapiService) {
    var endpoint = 'activities'
        , params = '?limit=32';

    $scope.title = 'Stream';
    $scope.data = '';

    SCapiService.get(endpoint, params)
                .then(function(data) {
                    $scope.data = data.collection;
                }, function(error) {
                    console.log('error', error);
                });

});