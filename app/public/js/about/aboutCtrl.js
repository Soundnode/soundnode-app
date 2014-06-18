'use strict';

app.controller('AboutCtrl', function ($scope, $http) {
    var url = 'https://api.github.com/repos/Soundnode/soundnode-about/contents/about.html'
        , config = { headers:  {
                'Accept': 'application/vnd.github.v3.raw+json'
            }
        };

    $scope.title = 'About';
    $scope.content = '';

    $http.get(url, config)
        .success(function (data) {
            $scope.content = data;
        })
        .error(function (error) {
            console.log('Error', error)
        });
});