'use strict';

app.controller('SettingsCtrl', function ($scope, notificationFactory) {
    $scope.title = "Settings";
    $scope.client_id = window.localStorage.scClientId;

    /**
     * Enable or disable song notification
     */
    if ( window.localStorage.notificationToggle ) {
        $scope.notification = JSON.parse(window.localStorage.notificationToggle);
    } else {
        window.localStorage.notificationToggle = $scope.notification = true;
    }

    $scope.notificationSettings = function() {
        window.localStorage.notificationToggle = $scope.notification;
    };

    $scope.scClientId = function () {
        window.localStorage.scClientId = $scope.client_id;
        window.settings.updateUserConfig();
    };

    /**
     * Clea storage which remove everything stored in window.localStorage
     */
    $scope.cleanStorage = function() {
        window.localStorage.clear();
        guiConfig.logOut();
    }

});
