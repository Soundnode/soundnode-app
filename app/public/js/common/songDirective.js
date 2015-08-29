'use strict';

app.directive('song', function ($rootScope, $window, playerService) {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs ) {
            var currentEl;

            elem.bind('click', function () {
                currentEl = this;

                playerService.songClicked(currentEl);
            });

        }
    }
});