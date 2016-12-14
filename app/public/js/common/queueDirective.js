'use strict';

app.directive('queueUp', function (
    $rootScope, queueService
) {
    return {
        restrict: 'A',

        link: function ($scope, elem, attrs) {
            var currentEl;

            elem.bind('click', function () {
                currentEl = this;

                $scope.$apply(function() {
                    queueService.insert($(currentEl).data(), true);
                });
            });
        }
    };
});
