'use strict';

app.directive('collapsible', function ($rootScope) {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs ) {

            elem.bind('click', function () {
                if ( elem.parent().attr('data-playlist-hidden') === 'true' ) {
                    elem.parent().attr('data-playlist-hidden', 'false');
                    elem.children().text('hide');
                } else {
                    elem.parent().attr('data-playlist-hidden', 'true');
                    elem.children().text('show');
                }
            });

        }
    }
});