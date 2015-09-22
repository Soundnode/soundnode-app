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
     * Clea storage which remove everything stored in window.localStorage
     */
    $scope.cleanStorage = function() {
        window.localStorage.clear();
        notificationFactory.success('Your local storage is clean.');
    }

});
