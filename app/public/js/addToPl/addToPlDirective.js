'use strict'

app.directive('addToPl', function ($rootScope, SCapiService, Song) {
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
                 SCapiService.saveToPl(userId , playlist, songId);
            });
        }
    }
});
