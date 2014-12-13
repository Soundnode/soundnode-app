'use strict'
app.directive('removePlaylist', function ($rootScope, SCapiService) {
    return {
        restrict: 'A',
        link: function($scope, elem, attrs) {
            var playlist;
            elem.bind('click', function() {
                var that = this;
                playlist = $scope.data.id;
                SCapiService.removePlaylist(playlist);
            });
        }
    }
});
