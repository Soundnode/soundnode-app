'use strict';

app.controller('SettingsCtrl', function ($scope, notificationFactory) {
    $scope.title: string = "Settings";
    $scope.client_id: string = window.localStorage.scClientId;

    /**
     * Enable or disable song notification
     */
    if (window.localStorage.notificationToggle) {
        $scope.notification: boolean = JSON.parse(window.localStorage.notificationToggle);
    } else {
        window.localStorage.notificationToggle = $scope.notification: boolean = true;
    }

    $scope.notificationSettings = function() {
        window.localStorage.notificationToggle = $scope.notification;
    };

    $scope.scClientId = function () {
        window.localStorage.scClientId = $scope.client_id;
        window.settings.updateUserConfig();
    };

    /**
     * Clear storage which remove everything stored in window.localStorage
     */
    $scope.cleanStorage = function() {
        window.localStorage.clear();
        guiConfig.logOut();
    }
});