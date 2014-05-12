'use strict';

app.controller('searchInputCtrl', function ($scope, $http, $state) {
    $scope.title = 'Search results';

    $scope.onSubmit = function(keyword) {
        $state.go('search', {q: keyword}, {reload: true});
    }
});