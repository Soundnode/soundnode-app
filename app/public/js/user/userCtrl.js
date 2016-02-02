'use strict'

app.controller('UserCtrl', function ($rootScope, $scope, $window, SCapiService) {
    var endpoint = 'me';
    var params = '';

    $rootScope.userId = '';

    SCapiService.get(endpoint, params)
                .then(function(data) {
                    $rootScope.userId = data.id;
                    $scope.data = data;
                }, function(error) {
                    console.log('error', error);
                });

    $scope.logOut = function() {
        $window.localStorage.clear();
        guiConfig.close();
    }

});
