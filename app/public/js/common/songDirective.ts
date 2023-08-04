'use strict';

app.directive('song', function ($rootScope, $window, playerService) {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs ) {
            let currentEl: HTMLElement;

            elem.bind('click', function () {
                currentEl = this;

                $scope.$apply(() => {
                    playerService.songClicked(currentEl);
                });
            });

            // Updating favorites when they get sent from other scope like the queue, stream, and player
            $scope.$on('track::favorited', function(event, trackId) {
                if ($scope.data.id === parseInt(trackId)) {
                    $scope.data.user_favorite = true;
                }
            });
            $scope.$on('track::unfavorited', function(event, trackId) {
                if ($scope.data.id === parseInt(trackId)) {
                    $scope.data.user_favorite = false;
                }
            });

        }
    }
});