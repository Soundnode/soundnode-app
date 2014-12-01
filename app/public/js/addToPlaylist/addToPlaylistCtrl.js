'use strict';

app.controller('AddToPlaylistCtrl', function ($scope, SCapiService, $rootScope, Song) {
    $scope.song = Song;
    $scope.title = 'Add to playlist';
    $scope.data = '';

    SCapiService.getPlaylists()
                .then(function(data) {
                    $scope.data = data;
                }, function(error) {
                    console.log('error', error);
                }).finally(function(){
                    $rootScope.isLoading = false;
                });

    $scope.checkForPlaceholder = function (thumb) {
        var newSize;
        if ( thumb === null ) {
            return 'public/img/temp-playing.png';
        } else {
            newSize = thumb.replace('large', 'badge');
            return newSize;
        }
    }

});
