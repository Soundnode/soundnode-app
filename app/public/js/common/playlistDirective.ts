'use strict';

app.directive('playlist', function ($rootScope, ngDialog, $log) {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs) {
            let playlistSongId = '';
            let playlistSongName = '';

            elem.bind('click', function () {
                playlistSongId = attrs.songId;
                playlistSongName = attrs.songName;

                ngDialog.open({
                    showClose: false,
                    scope: $scope,
                    controller: 'PlaylistDashboardCtrl',
                    template: 'views/playlists/playlistDashboard.html'
                });

            });
        }
    }
});