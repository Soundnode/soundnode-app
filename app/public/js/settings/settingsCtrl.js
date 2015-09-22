'use strict';

app.controller('SettingsCtrl', function ($scope, $rootScope) {
    $scope.notificationSettings = function() {
        window.localStorage.notificationToggle = $scope.notification;
    };

    $scope.init = function() {
        if(window.localStorage.notificationToggle === undefined) {
            window.localStorage.notificationToggle = true;
            $scope.notification = true;
        }
        else {
            $scope.notification = JSON.parse(window.localStorage.notificationToggle);
        }
    };

    $scope.init();
});
