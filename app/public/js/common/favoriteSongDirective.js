"use strict";

app.directive('favoriteSong', function($rootScope, $log, SCapiService) {
    return {
        restrict: 'A',
        link: function($scope, elem, attrs) {
            var userId
                , songId;

            elem.bind('click', function() {
                userId = $rootScope.userId;
                songId = attrs.songId;

                this.classList.add('clicked');

                if ( attrs.favoriteAction === 'save' ) {
                    SCapiService.saveFavorite(userId, songId);
                } 

                if ( attrs.favoriteAction === 'delete' ) {
                    SCapiService.deleteFavorite(userId, songId);
                }
            });
        }
    }
});