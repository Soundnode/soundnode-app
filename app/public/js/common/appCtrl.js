'use strict'

app.controller('AppCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $rootScope.playing = false;

    $scope.showBigArtwork = function (img) {
        var newArtwork;
        if ( img !== null ) {
            newArtwork = img.replace('large', 't300x300');
            return newArtwork;
        } else {
            return img;
        }
    }

}]);