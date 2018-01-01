'use strict'

app.directive('openExternal', function () {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs) {
            var el;

            elem.bind('click', function (e) {
                e.preventDefault();

                if ( this.hasAttribute('data-link') ) {
                    el = attrs.href;
                } else {
                    el = attrs.href + '?client_id=' + window.localStorage.scClientId;
                }
                gui.Shell.openExternal( el );
            });

        }
    }
})