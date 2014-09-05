"use strict";

app.directive('favoriteSong', function($rootScope, $log, SCapiService, $timeout) {
    return {
        restrict: 'A',
        link: function($scope, elem, attrs) {
            var userId
                , songId;

            elem.bind('click', function() {
                var that = this;

                userId = $rootScope.userId;
                songId = attrs.songId;

                this.classList.add('clicked');

                $timeout(function() {
                    that.classList.remove('clicked');
                }, 1000);

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