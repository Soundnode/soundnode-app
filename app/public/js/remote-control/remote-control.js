'use strict';

var fs = require('fs');
var http = require('http');

var ws = require('ws').Server;
var remoteControlHtml = fs.readFileSync('./views/remote-control/remote-control.html');
var remoteControlCss = fs.readFileSync('./views/remote-control/remote-control.css');
var remoteControlJs = fs.readFileSync('./views/remote-control/remote-control.js');

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
            case '/':
                res.end(remoteControlHtml);
                break;
            case '/remote-control.css':
                res.end(remoteControlCss);
                break;
            case '/remote-control.js':
                res.end(remoteControlJs);
                break;
        }
    });

    var wss = new ws({ server: server, path: '/__remote_control' });
    var elPlayer = document.getElementById('player');

    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            client.send(data);
        });
    };

    wss.on('connection', function connection(ws) {
        ws.send(JSON.stringify({
            id: 'init',
            playing: $rootScope.isSongPlaying,
            queue: queueService.list,
            position: queueService.currentPosition,
            progress: (elPlayer.currentTime / elPlayer.duration) * 100
        }));

        ws.on('message', function incoming(message) {
            switch (message) {
                case 'playpause':
                    if ($rootScope.isSongPlaying) {
                        playerService.pauseSong();
                        wss.broadcast(JSON.stringify({
                            id: 'playState',
                            playing: $rootScope.isSongPlaying
                        }));
                    } else {
                        playerService.playSong();
                        wss.broadcast(JSON.stringify({
                            id: 'playState',
                            playing: $rootScope.isSongPlaying
                        }));
                    }
                    break;
                case 'prev':
                    if ($rootScope.isSongPlaying) {
                        playerService.playPrevSong();
                    }
                    break;
                case 'next':
                    if ($rootScope.isSongPlaying) {
                        playerService.playNextSong();
                    }
                    break;
            }
        });
    });

    setInterval(function() {
        wss.broadcast(JSON.stringify({
            id: 'progress',
            progress: (elPlayer.currentTime / elPlayer.duration) * 100
        }));
    }, 1000);

    server.listen(8319);
});
