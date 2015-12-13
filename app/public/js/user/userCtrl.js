'use strict'

app.controller('UserCtrl', function ($rootScope, $scope, $window, userService) {
    var endpoint = 'me';
    var params = '';

    $rootScope.userId = '';

    userService.getUser()
        .then(function (data) {
            $rootScope.userId = data.id;
            $scope.data = data;
        })
        .catch(function (error) {
            console.error('error', error);
        });

    $scope.logOut = function() {
        $window.localStorage.clear();
        appGUI.close();
    }

});
