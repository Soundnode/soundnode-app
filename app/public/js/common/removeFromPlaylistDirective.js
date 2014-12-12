'use strict'
app.directive('removeFromPlaylist', function ($rootScope, SCapiService) {
    return {
        restrict: 'A',
        link: function($scope, elem, attrs) {
            var userId = $rootScope.userId;
            var playlist
            , songId;
            elem.bind('click', function() {
                var that = this;
                songId = attrs.songId;
                playlist = $scope.data.id;
                SCapiService.removeSongFromPlaylist(userId , playlist, songId);
            });
        }
    }
});
