'use strict';

app.directive('tracks', function () {
    return {
        restrict: 'AE',
        scope: {
            data: '=',
            user: '=',
            type: '=',
            list: '='
        },
        templateUrl: "views/common/tracks.html"
    };
});