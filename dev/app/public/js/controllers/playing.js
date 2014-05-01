'use strict'

app.controller('PlayingCtrl', ['$scope', '$http', function ($scope, $http) {
    // $http({method: 'GET', url: 'stream/url'}).
    //     success(function(data, status, headers, config) {
          
    //     }).
    //     error(function(data, status, headers, config) {
          
    //     });
    
    $scope.imgPath = 'public/img/temp-playing.png';
    $scope.title = 'Emancipator'
}])