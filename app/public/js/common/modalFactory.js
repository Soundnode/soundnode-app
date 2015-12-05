'use strict';

app.factory('modalFactory', function (
    $http,
    ngDialog
) {

    var modalFactory = {
        // Unified modal to ask for confirmation of some action
        confirm: confirm,
        // Displays modal with a warning that rate limit is reached, with a link
        // to SoundCloud docs attached. Call it when response returns 429 status
        rateLimitReached: rateLimitReached
    };

    return modalFactory;

    //

    function confirm(message) {
        return ngDialog.openConfirm({
            showClose: false,
            template: 'views/common/modals/confirm.html',
            controller: ['$scope', function ($scope) {

                $scope.content = message;

                $scope.closeModal = function () {
                    ngDialog.closeAll();
                };
            }]
        });
    }

    function rateLimitReached() {
        return ngDialog.open({
            showClose: false,
            template: 'views/common/modals/default.html',
            controller: ['$scope', function ($scope) {
                var urlGH = 'https://api.github.com/repos/Soundnode/soundnode-about/contents/rate-limit-reached.html';
                var config = {
                    headers: {
                        'Accept': 'application/vnd.github.v3.raw+json'
                    }
                };

                $scope.content = '';

                $scope.closeModal = function () {
                    ngDialog.closeAll();
                };

                $http.get(urlGH, config)
                    .then(function (response) {
                        $scope.content = response.data;
                    })
                    .catch(function (response) {
                        console.log('Error', response.data);
                    });
            }]
        });
    }

});
