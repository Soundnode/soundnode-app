'use strict';

app.controller('searchCtrl', function (
    $scope: ng.IScope,
    $rootScope: ng.IRootScopeService,
    $http: ng.IHttpService,
    $stateParams: ng.ui.IStateParamsService,
    SCapiService: any,
    utilsService: any
) {

    $scope.title = 'Results for: ' + $stateParams.q;
    $scope.data = '';
    const limit = 20;

    SCapiService.search('tracks', limit, $stateParams.q)
        .then(function(data: any) {
            $scope.data = data.collection;
        }, function(error: any) {
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
            .then(function(data: any) {
                for ( let i = 0; i < data.collection.length; i++ ) {
                    $scope.data.push( data.collection[i] )
                }
                utilsService.updateTracksReposts(data.collection, true);
            }, function(error: any) {
                console.log('error', error);
            }).finally(function(){
                $scope.busy = false;
                $rootScope.isLoading = false;
            });
    };

});