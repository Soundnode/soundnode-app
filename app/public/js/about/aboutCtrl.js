'use strict';

app.controller('AboutCtrl', function ($scope, $http, $rootScope, ngDialog, $window) {
    var urlAbout = 'https://api.github.com/repos/Soundnode/soundnode-about/contents/about.html'
        , config = { headers:  {
                'Accept': 'application/vnd.github.v3.raw+json'
            }
        },
        urlRelease = 'https://api.github.com/repos/Soundnode/soundnode-app/releases'
        , config = { headers:  {
                'Accept': 'application/vnd.github.v3.raw+json'
            }
        };

    $scope.appVersion = $window.settings.appVersion;
    $scope.appLatestVersion = '';
    $scope.content = '';

    $scope.openModal = function() {
        ngDialog.open({
            showClose: false,
            template: 'views/about/about.html',
            scope: $scope
        });
    };

    /**
     * Get Soundnode about.html form Github
     */
    $http.get(urlAbout, config)
        .success(function (data) {
            $scope.content = data;
        })
        .error(function (error) {
            console.log('Error', error)
        });


    /**
     * Get App version from latest release from Github
     */
    $http.get(urlRelease, config)
        .success(function (data) {
            var release = data[0];
            $scope.appLatestVersion = release.tag_name;
        })
        .error(function (error) {
            console.log('Error on getting latest release', error);
        });

});