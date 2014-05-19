'use strict'

app.controller('playerCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.imgPath = 'public/img/temp-playing.png';

    console.log( $scope )
    console.log( $rootScope )
    console.log( $rootScope.playing )

    $scope.playPause = function($event) {
        var el = $event.currentTarget;

        if ( el.classList.contains('playing') ) {
            el.classList.remove('playing');
            $rootScope.playing = false;
        } else {
            el.classList.add('playing');
            $rootScope.playing = true;
        }
    };
}]);