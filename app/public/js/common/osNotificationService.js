app.factory('osNotificationService', function (
  $window
) {
  var songNotification;
  var osNotificationService = {};

  /**
   * Check if track title needs to be shortned
   * and return
   * @param {string} trackTitle (track title)
   */
  function shortTrackTitle(trackTitle) {
    return (trackTitle.length > 63 && process.platform == "win32") ? trackTitle.substr(0, 60) + "..." : trackTitle;
  }

  /**
   *  Check if user config is enabled to display
   * OS native notification
   *
   * @param {any} trackObj (track object)
   */
  osNotificationService.show = function(trackObj) {
    if ($window.localStorage.notificationToggle === "true") {
      songNotification = new Notification(shortTrackTitle(trackObj.songTitle), {
        body: trackObj.songUser,
        icon: trackObj.songThumbnail,
        silent: true
      });
      songNotification.onclick = function () {
        ipcRenderer.send('showApp');
      };
    }
  }

  return osNotificationService;
});