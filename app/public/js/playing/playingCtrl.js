'use strict'

app.controller('PlayingCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.imgPath = 'public/img/temp-playing.png';
    $scope.title = '';
    $scope.user = '';
}])