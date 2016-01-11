'use strict';

app.directive('playlist', function ($rootScope, ngDialog, $log) {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs) {
            $scope.playlistSongId = '';
            $scope.playlistSongName = '';

            elem.bind('click', function () {
                $scope.playlistSongId = attrs.songId;
                $scope.playlistSongName = attrs.songName;

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