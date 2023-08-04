'use strict';

app.controller('UserCtrl', function (
  $rootScope: ng.IRootScopeService,
  $scope: ng.IScope,
  $window: ng.IWindowService,
  $state: ng.ui.IStateService,
  SCapiService: any
) {
  let endpoint: string = 'me';
  let params: string = '';

  $rootScope.userId: string = '';

  SCapiService.get(endpoint, params)
    .then(function (data: any) {
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