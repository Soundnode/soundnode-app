'use strict';

app.controller('UserCtrl', function (
  $rootScope,
  $scope,
  $window,
  $state,
  SCapiService
) {
  var endpoint = 'me';
  var params = '';

  $rootScope.userId = '';

  SCapiService.get(endpoint, params)
    .then(function (data) {
      $rootScope.userId = data.id;
      $scope.data = data;
    }, function () {
      guiConfig.logOut();
    });

  $scope.logOut = function () {
    $window.localStorage.clear();
    guiConfig.logOut();
  }

  $scope.loadUserProfile = function () {
    $state.go('profile', { id: $rootScope.userId });
  }
});
