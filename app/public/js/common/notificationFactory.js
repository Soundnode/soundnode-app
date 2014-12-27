'use strict';

app.factory('notificationFactory', function () {
    return {
        success: function (message) {
            toastr.success(message, "Success");
        },
        warning: function (message) {
            toastr.error(message, "Hey");
        },
        info: function (message) {
            toastr.error(message, "FYI");
        },
        error: function (message) {
            toastr.error(message, "Oh No");
        }
    };
});