'use strict';

app.controller('searchCtrl', function ($scope, $http, $stateParams, SCapiService) {
    var endpoint = 'tracks'
        , params = 'limit=51&q=' + $stateParams.q;

    $scope.title = 'Results for: ' + $stateParams.q;
    $scope.data = '';
    $scope.busy = false;

    SCapiService.get(endpoint, params)
        .then(function(data) {
            $scope.data = data;
        }, function(error) {
            console.log('error', error);
        });

});