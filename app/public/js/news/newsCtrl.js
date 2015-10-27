'use strict';

app.controller('NewsCtrl', function(
    $scope,
    $rootScope,
    $http
) {
    var urlNews = 'https://api.github.com/repos/Soundnode/soundnode-about/contents/news.html';
    var config = {
        headers:  {
            'Accept': 'application/vnd.github.v3.raw+json'
        }
    };

    $scope.content = '';

    // get news.html from Github
    $http.get(urlNews, config)
        .success(function (data) {
            $scope.content = data;
        })
        .error(function (error) {
            console.log('Error', error)
        });

});