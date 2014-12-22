"use strict"

app.controller('PlaylistDashboardCtrl', function($rootScope, $scope, SCapiService, $log) {
    var endpoint = 'me/playlists'
        , params = '';

    $scope.data = '';

    SCapiService.get(endpoint, params)
        .then(function(data) {
            $scope.data = data;
        }, function(error) {
            console.log('error', error);
        }).finally(function() {
            $rootScope.isLoading = false;
        });

    $scope.saveToPlaylist = function(playListId) {
        $log.log('save to playlist', $scope.playlistSongId, playListId);
    }

    $scope.checkForPlaceholder = function (thumb) {
        var newSize;

        if ( thumb === null ) {
            return 'public/img/logo-badge.png';
        } else {
            newSize = thumb.replace('large', 'badge');
            return newSize;
        }
    }
});