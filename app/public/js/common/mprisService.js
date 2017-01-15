"use strict";

const {
  ipcRenderer
} = require('electron');

/**
 * mpris integration for linux systems using DBUS
 */
app.factory("mprisService", function ($rootScope, $log, $timeout, $window, $state) {
  // media keys are supported on osx/windows already anyway
  var supportedPlatforms = {
    "linux": false,
    "win32": false,
    "darwin": false
  };

  // We check if the platform is supported
  if (!supportedPlatforms[process.platform]) return false;

  // Require mpris
  var Player = require("mpris-service");

  // Initialize & configure mpris
  var mprisPlayer = Player({
    canRaise: true,
    name: "soundnode",
    identity: "Soundnode",
    desktopEntry: "soundnode",
    supportedInterfaces: ["player"],
    supportedUriSchemes: ["http", "file"],
    supportedMimeTypes: ["audio/mpeg", "application/ogg"]
  });

  // Configuration
  mprisPlayer.canControl = true;
  mprisPlayer.canSeek = false;

  // When the user asks dbus to show the player, we'll show it.
  mprisPlayer.on("raise", function () {
    gui.Window.get().show();
  });

  /** Functions **/

  /**
   * This is called whenever you play/resume a track.
   *
   * @param trackid   {number}    (SC Track ID)
   * @param length    {number}    (Microseconds - Integer)
   * @param artwork   {uri}
   * @param title     {string}
   * @param artist    {string}
   */
  mprisPlayer.play = function (trackid, length, artwork, title, artist) {
    /** Overrides **/
    length = 0; // UNSUPPORTED

    mprisPlayer.metadata = {
      "mpris:trackid": mprisPlayer.objectPath("track/" + trackid),
      "mpris:length": length,
      "mpris:artUrl": artwork,
      "xesam:title": title,
      "xesam:album": "",
      "xesam:artist": artist
    };

    // Tell dbus/mpris that we're currently playing.
    mprisPlayer.playbackStatus = "Playing";
  };

  /**
   * Tells mpris that we're paused.
   */
  mprisPlayer.pause = function () {
    mprisPlayer.playbackStatus = "Paused";
  };

  /**
   * This is called whenever you stop playback
   */
  mprisPlayer.stop = function () {
    mprisPlayer.playbackStatus = "Stopped";
  };

  // Return the mprisPlayer object
  return mprisPlayer;
});
