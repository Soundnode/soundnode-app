'use strict'

app.directive('saveSong', function ($rootScope, SCapiService, $timeout, ngDialog, Song) {
    
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
                    $rootScope.showpopup = true;
                    userId = $rootScope.userId;
                    $scope.song.songid = attrs.songId;
                    ngDialog.open({
                        showClose: false,
                        template: 'views/addToPlaylist/addToPlaylist.html',
                        controller: 'overlayCtrl',
                    });
                 
                }

            });
        }
    }
});
