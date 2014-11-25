'use strict';

app.controller('searchCtrl', function ($scope, $http, $stateParams, SCapiService, $rootScope) {

    $scope.title = 'Results for: ' + $stateParams.q;
    $scope.data = '';
    var limit = 20;

    SCapiService.searchTracks(limit, $stateParams.q)
        .then(function(data) {
            $scope.data = data.collection;
        }, function(error) {
            console.log('error', error);
        }).finally(function(){
            $rootScope.isLoading = false;
        });

    $scope.loadMore = function() {
        if ($scope.busy) {
            return;
        }
        $scope.busy = true;

        SCapiService.getNextPage()
            .then(function(data) {
                for ( var i = 0; i < data.collection.length; i++ ) {
                    $scope.data.push( data.collection[i] )
                }
            }, function(error) {
                console.log('error', error);
            }).finally(function(){
                $scope.busy = false;
                $rootScope.isLoading = false;
            });
    };

});