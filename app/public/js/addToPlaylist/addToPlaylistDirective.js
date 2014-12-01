'use strict'

app.directive('addToPlaylist', function ($rootScope, SCapiService, Song) {
     return {
         restrict: 'A',
         link: function($scope, elem, attrs) {
             $scope.song = Song;
             var song =  $scope.song;
             var userId = $rootScope.userId;
             var playlist
                 , songId;
             elem.bind('click', function() {
                 var that = this;
                 songId = song.songid;
                 playlist = $scope.data.id;
                 SCapiService.saveToPlaylist(userId , playlist, songId);
            });
        }
    }
});
