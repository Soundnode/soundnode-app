'use strict';

app.controller('PlaylistsCtrl', function ($scope, SCapiService, $rootScope) {

    $scope.title = 'Playlists';
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