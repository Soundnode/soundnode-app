'use strict';

app.controller('AboutCtrl', function ($scope, $http, $rootScope) {
    var url = 'https://api.github.com/repos/Soundnode/soundnode-about/contents/about.html'
        , config = { headers:  {
                'Accept': 'application/vnd.github.v3.raw+json'
            }
        };

    $rootScope.isAboutVisible = false;
    $scope.content = '';

    $scope.toggleAboutView = function() {
        if ( $rootScope.isAboutVisible ) {
            $rootScope.isAboutVisible = false;
        } else {
            $rootScope.isAboutVisible = true;
        }
    }

    $http.get(url, config)
        .success(function (data) {
            $scope.content = data;
        })
        .error(function (error) {
            console.log('Error', error)
        });
});