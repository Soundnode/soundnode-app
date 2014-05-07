app.directive('downloadSong', function () {
    var el;

    return {
        restrict: 'A',
        link: function ($scope, elem, attrs) {
            elem.bind('click', function () {
                el = this.getAttribute('href') + '?client_id=' + window.scClientId;
                gui.Shell.openExternal( el );
            })
        }
    }
})