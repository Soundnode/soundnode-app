'use strict'

app.controller('FavoritesCtrl', function ($scope, SCapiService) {
    var endpoint = 'favorites';

    $scope.title = 'Favorites';
    $scope.data = '';

    SCapiService.get(endpoint)
                .then(function(data) {
                    $scope.data = data;
                }, function(error) {
                    console.log('error', error);
                });

});