"use strict";

app.directive('favoriteSong', function($rootScope, $log, SCapiService, $timeout, $state, $stateParams, notificationFactory) {
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

                $log.log('favorite action', typeof attrs.favoriteAction);

                if ( attrs.favoriteAction === 'true' ) {
                    $log.log('inside true')

                    SCapiService.deleteFavorite(userId, songId)
                        .then(function(status) {
                            if ( typeof status == "object" ) {
                                notificationFactory.success("Song removed from likes!");
                            }
                        }, function() {
                            notificationFactory.error("Something went wrong!");
                        })
                        .finally(function() {
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        });
                } else if ( attrs.favoriteAction == 'false' ) {
                    SCapiService.saveFavorite(userId, songId)
                        .then(function(status) {
                            if ( typeof status == "object" ) {
                                notificationFactory.success("Song added to likes!");
                            }
                        }, function(status) {
                            notificationFactory.error("Something went wrong!");
                        });
                }

            });
        }
    }
});