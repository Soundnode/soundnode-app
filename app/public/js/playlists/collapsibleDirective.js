'use strict';

app.directive('collapsible', function ($rootScope) {
    return {
        restrict: 'A',
        scope: {
            // Executes a method from a parent
            // when collapsible opens for the first time
            collapsibleOnFirstOpen: '&'
        },
        link: function ($scope, elem, attrs ) {

            var isFirstOpen = true;

            elem.bind('click', function () {
                if ( elem.parent().attr('data-playlist-hidden') === 'true' ) {
                    elem.parent().attr('data-playlist-hidden', 'false');
                    elem.children().text('hide');
                    if (isFirstOpen) {
                        $scope.collapsibleOnFirstOpen();
                        isFirstOpen = false;
                    }
                } else {
                    elem.parent().attr('data-playlist-hidden', 'true');
                    elem.children().text('show');
                }
            });

        }
    }
});