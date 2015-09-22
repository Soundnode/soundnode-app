'use strict';

app.controller('SettingsCtrl', function ($scope, $rootScope) {
    $scope.title = "Settings";

    if ( window.localStorage.notificationToggle ) {
        $scope.notification = JSON.parse(window.localStorage.notificationToggle);
    } else {
        window.localStorage.notificationToggle = $scope.notification = true;
    }

    $scope.label = window.localStorage.notificationToggle ? "enabled": "disabled";

    $scope.notificationSettings = function() {
        window.localStorage.notificationToggle = $scope.notification;
        $scope.label = $scope.notification ? "enabled": "disabled";
    };

});
