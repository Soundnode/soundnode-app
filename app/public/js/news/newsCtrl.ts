'use strict';

app.controller('NewsCtrl', function (
  $scope: ng.IScope,
  $rootScope: ng.IRootScopeService,
  $http: ng.IHttpService
) {
  const urlNews = 'https://api.github.com/repos/Soundnode/soundnode-about/contents/news.html';
  const config: ng.IRequestConfig = {
    headers: {
      'Accept': 'application/vnd.github.v3.raw+json'
    }
  };

  $scope.content = '';

  // get news.html from Github
  $http({
    method: 'GET',
    url: urlNews,
    headers: config.headers
  }).then(function (response: ng.IHttpResponse<any>) {
    $scope.content = response.data;
  }, function (error: ng.IHttpResponse<any>) {
    console.log('Error', error);
  });

});