'use strict';

app.directive('copyDirective', function (
    notificationFactory: any
) {
    return {
        restrict: 'A',
        
        link: function ($scope: any, elem: any, attrs: any) {

            elem.bind('click', function () {
                let info = elem.attr('data-copy');
                const clipboard = gui.Clipboard.get();
                clipboard.set(info, 'text');
                notificationFactory.success("Song url copied to clipboard!");
            });
        }
    };
});