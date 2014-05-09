'use strict';

app.controller('searchCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.title = 'Search result';

    $scope.onSubmit = function (attrs) {
        console.log(attrs)
    }
}]);