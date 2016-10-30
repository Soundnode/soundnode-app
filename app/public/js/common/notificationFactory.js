'use strict';

const toastr = require(`../node_modules/toastr/build/toastr.min.js`);

app.factory('notificationFactory', function () {
  return {
    success: function (message) {
      toastr.success(message, "Success");
    },
    warn: function (message) {
      toastr.warning(message, "Hey");
    },
    info: function (message) {
      toastr.info(message, "FYI");
    },
    error: function (message) {
      toastr.error(message, "Oh No");
    }
  };
});