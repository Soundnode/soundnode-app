'use strict';

app.directive('copyDirective', function (
    notificationFactory
) {
    return {
        restrict: 'A',
        
        link: function ($scope, elem, attrs) {

            elem.bind('click', function () {
                var info = elem.attr('data-copy');
                var clipboard = gui.Clipboard.get();
                clipboard.set(info, 'text');
                notificationFactory.success("Song url copied to clipboard!");
            });
        }
    };
});