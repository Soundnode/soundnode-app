'use strict';

var fs = require('fs');
var http = require('http');
var remoteControl = fs.readFileSync('./views/remote-control/remote-control.html');

app.controller('RemoteCtrl', function (
    $scope,
    $rootScope,
    playerService,
    mprisService,
    queueService,
    hotkeys,
    $state,
    $log,
    $timeout,
    SCapiService,
    notificationFactory
) {
    var server = http.createServer(function (req, res) {
        switch (req.url) {
            case '/playpause':
                if ($rootScope.isSongPlaying) {
                    playerService.pauseSong();
                } else {
                    playerService.playSong();
                }
                break;
            case '/prev':
                if ($rootScope.isSongPlaying) {
                    playerService.playPrevSong();
                }
                break;
            case '/next':
                if ($rootScope.isSongPlaying) {
                    playerService.playNextSong();
                }
                break;
        }
        res.end(remoteControl);
    });
    server.listen(8319);
});
