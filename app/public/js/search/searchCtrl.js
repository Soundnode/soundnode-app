'use strict';

app.controller('searchCtrl', function (
    $scope,
    $rootScope,
    $http,
    $stateParams,
    SCapiService,
    utilsService
) {

    $scope.title = 'Results for: ' + $stateParams.q;
    $scope.data = '';
    var limit = 20;

    SCapiService.search('tracks', limit, $stateParams.q)
        .then(function(data) {
            $scope.data = data.collection;
        }, function(error) {
            console.log('error', error);
        }).finally(function(){
            utilsService.updateTracksReposts($scope.data);
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
                utilsService.updateTracksReposts(data.collection, true);
            }, function(error) {
                console.log('error', error);
            }).finally(function(){
                $scope.busy = false;
                $rootScope.isLoading = false;
            });
    };

});
