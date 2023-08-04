'use strict';

import * as toastr from 'toastr';

export const notificationFactory = {
  success: (message: string) => {
    toastr.success(message, "Success");
  },
  warn: (message: string) => {
    toastr.warning(message, "Hey");
  },
  info: (message: string) => {
    toastr.info(message, "FYI");
  },
  error: (message: string) => {
    toastr.error(message, "Oh No");
  }
};