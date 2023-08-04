'use strict'

app.controller('TracksCtrl', function ($scope, SCapiService, $rootScope) {
    const endpoint: string = 'me/tracks';
    const params: string = 'limit=33';

    $scope.title: string = 'Tracks';
    $scope.data: any = '';
    $scope.busy: boolean = false;

    SCapiService.get(endpoint, params)
                .then(function(data: any) {
                    $scope.data = data;
                }, function(error: any) {
                    console.log('error', error);
                }).finally(function() {
                    $rootScope.isLoading = false;
                });

    $scope.loadMore = function() {
        if ( $scope.busy ) {
            return;
        }
        $scope.busy = true;

        SCapiService.getNextPage()
            .then(function(data: any) {
                for ( let i: number = 0; i < data.length; i++ ) {
                    $scope.data.push( data[i] )
                }
            }, function(error: any) {
                console.log('error', error);
            }).finally(function(){
                $scope.busy = false;
                $rootScope.isLoading = false;
            });
    };

});