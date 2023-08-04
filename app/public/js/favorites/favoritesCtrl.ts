'use strict';

app.controller('FavoritesCtrl', function (
    $scope: ng.IScope,
    $rootScope: ng.IRootScopeService,
    SCapiService: any,
    utilsService: any
) {
    const endpoint: string = 'me/favorites';
    const params: string = 'linked_partitioning=1';

    $scope.title: string = 'Likes';
    $scope.data: any = '';
    $scope.busy: boolean = false;

    SCapiService.get(endpoint, params)
        .then(function(data: any) {
            $scope.data = data.collection;
        }, function(error: any) {
            console.log('error', error);
        }).finally(function() {
            utilsService.updateTracksReposts($scope.data);
            $rootScope.isLoading = false;
            utilsService.setCurrent();
        });

    $scope.loadMore = function() {
        if ( $scope.busy ) {
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
                utilsService.setCurrent();
            });
    };

});