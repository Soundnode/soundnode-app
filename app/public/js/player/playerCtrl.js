'use strict'

app.controller('playerCtrl', function ($scope, $rootScope) {
    var elPlayer = document.getElementById('player')
    $scope.imgPath = 'public/img/temp-playing.png';
    $scope.playingSong = '';

    $rootScope.$on('songClicked', function() {
        console.log('current time', elPlayer.currentTime)
        console.log('is paused', elPlayer.paused)

        if ( elPlayer.currentTime !== 0 && !elPlayer.paused ) {
            $scope.playingSong = true;
        } else if ( elPlayer.currentTime === 0 && elPlayer.paused ) {
            $scope.playingSong = false;
        }
    });

    $scope.$watch('playingSong', function() {
        console.log('playingSong changed')
    });

    $scope.playPause = function($event) {

    };
});