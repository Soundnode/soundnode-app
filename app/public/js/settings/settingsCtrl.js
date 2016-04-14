'use strict';

app.controller('SettingsCtrl', function ($scope, notificationFactory) {
    $scope.title = "Settings";

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

    /**
     * Enable or disable minimize to tray
     * ONLY FOR WINDOWS OS
     */
    if ( window.localStorage.minimizeToTray ) {
        $scope.minimize = JSON.parse(window.localStorage.minimizeToTray);
    } else {
        window.localStorage.minimizeToTray = $scope.minimize = false;
    }

    $scope.minimizeSettings = function() {
        window.localStorage.minimizeToTray = $scope.minimize;
    };

    $scope.showTraySettings = (process.platform === 'win32');

    /**
     * Clea storage which remove everything stored in window.localStorage
     */
    $scope.cleanStorage = function() {
        window.localStorage.clear();
        notificationFactory.success('Your local storage is clean.');
    }

});
