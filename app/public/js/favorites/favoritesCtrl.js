'use strict'

app.controller('FavoritesCtrl', function ($scope, SCapiService) {
    var endpoint = 'favorites'
        , params = '?';

    $scope.title = 'Favorites';
    $scope.data = '';

    SCapiService.get(endpoint, params)
                .then(function(data) {
                    $scope.data = data;
                }, function(error) {
                    console.log('error', error);
                });

});