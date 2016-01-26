'use strict';

app.directive('song', function ($rootScope, $window, playerService) {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs ) {
            var currentEl;

            elem.bind('click', function () {
                currentEl = this;

                $scope.$apply(function() {
                    playerService.songClicked(currentEl);
                });
            });

        }
    }
});