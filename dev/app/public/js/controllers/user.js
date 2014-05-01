'use strict'

app.controller('userController', ['$scope', '$http', function ($scope, $http) {
    $scope.name = 'Michael Lancaster';
    $scope.userThumb = 'public/img/temp-user.jpg';
    $scope.userThumbWidth = '50px';
    $scope.userThumbHeight = '50px';
}]);