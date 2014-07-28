'use strict';

app.controller('searchCtrl', function ($scope, $http, $stateParams, SCapiService, $rootScope) {
    var endpoint = 'tracks'
        , params = 'limit=51&q=' + $stateParams.q;

    $scope.title = 'Results for: ' + $stateParams.q;
    $scope.data = '';

    SCapiService.get(endpoint, params)
        .then(function(data) {
            $scope.data = data;
        }, function(error) {
            console.log('error', error);
        }).finally(function(){
            $rootScope.isLoading = false;
        });

});