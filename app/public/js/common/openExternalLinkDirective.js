app.directive('openExternal', function () {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs) {
            var el;

            elem.bind('click', function (e) {
                e.preventDefault();

                el = attrs.href + '?client_id=' + window.scClientId;
                gui.Shell.openExternal( el );
            });

        }
    }
})