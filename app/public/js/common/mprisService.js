'use strict';

var gui = require('nw.gui');

app.factory('mprisService', function($rootScope, $log, $timeout, $window, $state) {
    if(process.platform !== "linux") {
        return false;
    }

    var Player = require('mpris-service');

    var mprisPlayer = Player({
        name: 'soundnode',
        identity: 'Soundnode Player',
        supportedUriSchemes: ['http', 'file'],
        supportedMimeTypes: ['audio/mpeg', 'application/ogg'],
        supportedInterfaces: ['player']
    });

    mprisPlayer.on('raise', function() {
        gui.Window.get().show();
    });

    mprisPlayer.canControl = true;

    mprisPlayer.canSeek = false;

    // Export Functions
    mprisPlayer.play = function(length, artwork, title, artist) {
        mprisPlayer.metadata = {
            'mpris:trackid': mprisPlayer.objectPath('track/0'),
            'mpris:length': length,
            'mpris:artUrl': artwork,
            'xesam:title': title,
            'xesam:album': '',
            'xesam:artist': artist
        };

        mprisPlayer.playbackStatus = 'Playing';
    };

    mprisPlayer.pause = function() {
        mprisPlayer.playbackStatus = 'Paused';
    };

    return mprisPlayer;
});
