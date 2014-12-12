'use strict';

app.controller('overlayCtrl', function ($scope, SCapiService, $rootScope, Song, ngDialog) {

    $scope.song = Song;
    $scope.playlistsdata = '';

    SCapiService.getPlaylists()
        .then(function(data) {
            $scope.playlistsdata = data;
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
    };

    
    $scope.closeModal = function() {
        ngDialog.closeAll();
    };

});
