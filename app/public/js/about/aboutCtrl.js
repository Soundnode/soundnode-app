'use strict';

app.controller('AboutCtrl', function (
  $scope,
  $http,
  $rootScope,
  ngDialog,
  $window
) {
  var urlAbout = 'https://api.github.com/repos/Soundnode/soundnode-about/contents/about.html';
  var urlRelease = 'https://api.github.com/repos/Soundnode/soundnode-app/releases';
  var config = {
    headers: {
      'Accept': 'application/vnd.github.v3.raw+json'
    }
  };

  $scope.appVersion = $window.settings.appVersion;
  $scope.appLatestVersion = '';
  $scope.content = '';
  $scope.isLatest = ($scope.appVersion >= $scope.appLatestVersion);

  $scope.openModal = function () {
    ngDialog.open({
      showClose: false,
      template: 'views/about/about.html',
      scope: $scope
    });
  };

  /**
   * Get Soundnode about.html from Github
   */
  $http({
    method: 'GET',
    url: urlAbout,
    headers: config.headers
  }).then(function successCallback(response) {
    $scope.content = response.data
  }, function errorCallback(error) {
    console.log('Error retrieving about', error)
  });

  /**
   * Get App version from latest release from Github
   */
  $http({
    method: 'GET',
    url: urlRelease,
    headers: config.headers
  }).then(function successCallback(response) {
    var release = response.data[0];
    $scope.appLatestVersion = release.tag_name;
  }, function errorCallback(error) {
    console.log('Error retrieving latest release', error);
  });

});