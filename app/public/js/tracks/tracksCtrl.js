'use strict'

app.controller('TracksCtrl', function ($scope, SCapiService, $rootScope) {
    var endpoint = 'me/tracks'
        , params = 'limit=33';

    $scope.title = 'Tracks';
    $scope.data = '';
    $scope.busy = false;

    SCapiService.getTracks(endpoint, params)
                .then(function(data) {
                    $scope.data = data;
                }, function(error) {
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
            .then(function(data) {
                for ( var i = 0; i < data.length; i++ ) {
                    $scope.data.push( data[i] )
                }
            }, function(error) {
                console.log('error', error);
            }).finally(function(){
                $scope.busy = false;
                $rootScope.isLoading = false;
            });
    };

});
