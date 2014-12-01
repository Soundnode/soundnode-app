'use strict'

app.directive('saveSong', function ($rootScope, SCapiService, $timeout, Song) {
   
    return {
        restrict: 'A',
        link: function($scope, elem, attrs) {
            var userId;
            $scope.song = Song;
            elem.bind('click', function() {
                var that = this;
                this.classList.add('clicked');
                $timeout(function() {
                    that.classList.remove('clicked');
                }, 1000);
                if ( attrs.favoriteAction === 'saveToPlaylist') {

                    userId = $rootScope.userId;
                    $scope.song.songid = attrs.songId;
                }

            });
        }
    }
});
