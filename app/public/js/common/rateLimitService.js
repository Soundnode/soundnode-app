'use strict';

// Displays popup with a warning that rate limit is reached, with a link
// to SoundCloud docs attached. Call it when response returns 429 status
app.service('rateLimit', function (
    $http,
    ngDialog
) {
    this.showNotification = function () {
        return ngDialog.open({
            showClose: false,
            template: 'views/common/modal.html',
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
    };
});
