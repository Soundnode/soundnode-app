'use strict'

app.controller('StreamCtrl', function ($scope, SCapiService) {
    var endpoint = 'activities'
        , params = 'limit=33';

    $scope.title = 'Stream';
    $scope.data = '';
    $scope.nextPagedata = '';

    SCapiService.get(endpoint, params)
                .then(function(data) {
                    $scope.data = data.collection;
                }, function(error) {
                    console.log('error', error);
                });

    $scope.loadMore = function() {
        SCapiService.getNextPage()
                    .then(function(data) {
                        for ( var i = 0; i < data.collection.length; i++ ) {
                            $scope.data.push( data.collection[i] )
                        }
                    }, function(error) {
                        console.log('error', error);
                    });
    }

});