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
    }

    /**
     * Enable or disable remote controller
     */
    if ( window.localStorage.remoteControllerToggle ) {
        $scope.remoteController = JSON.parse(window.localStorage.remoteControllerToggle);
    } else {
        window.localStorage.remoteControllerToggle = $scope.remoteController = false;
    }

    $scope.remoteControllerSettings = function() {
        window.localStorage.remoteControllerToggle = $scope.remoteController;
        if ($scope.remoteController === true) {
            notificationFactory.info('You can access the remote controller at port 8319 after a restart');
        } else {
            notificationFactory.info('The remote controller will be disabled after a restart')
        }
    }

    /**
     * Clean storage which remove everything stored in window.localStorage
     */
    $scope.cleanStorage = function() {
        window.localStorage.clear();
        notificationFactory.success('Your local storage is clean.');
    }

});
