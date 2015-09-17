'use strict';

app.controller('tagCtrl', function ($scope, $http, $stateParams, SCapiService, $rootScope) {
    var tagUrl = encodeURIComponent($stateParams.name);

    $scope.tag = $stateParams.name;
    $scope.data = '';

    SCapiService.get('search/sounds', 'limit=32&q=*&filter.genre_or_tag=' + tagUrl)
        .then(function (data) {
            $scope.data = data.collection;
        }, function (error) {
            console.log('error', error);
        }).finally(function () {
            $rootScope.isLoading = false;
        });

    $scope.loadMore = function () {
        if ( $scope.busy || !SCapiService.isNextPage()) {
            return;
        }
        $scope.busy = true;

        SCapiService.getNextPage()
            .then(function (data) {
                for (var i = 0; i < data.collection.length; i++) {
                    $scope.data.push(data.collection[i])
                }
            }, function (error) {
                console.log('error', error);
            }).finally(function () {
                $scope.busy = false;
                $rootScope.isLoading = false;
            });
    };

});
