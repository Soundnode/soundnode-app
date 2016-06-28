'use strict';

var fs = require('fs');
var http = require('http');

var ws = require('ws').Server;
var remoteControlHtml = fs.readFileSync('./views/remote-control/remote-control.html');
var remoteControlCss = fs.readFileSync('./views/remote-control/remote-control.css');
var remoteControlJs = fs.readFileSync('./views/remote-control/remote-control.js');
var placeholderPng = fs.readFileSync('./public/img/song-placeholder.png');
var faviconIco = fs.readFileSync('./soundnode.ico');

app.controller('RemoteCtrl', function(
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
    var server = http.createServer(function(req, res) {
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
            case '/placeholder.png':
                res.end(placeholderPng);
                break;
            case '/favicon.ico':
                res.end(faviconIco);
                break;
        }
    });

    var wss = new ws({ server: server, path: '/__remote_control' });
    var elPlayer = document.getElementById('player');
    var queue = queueService.list;

    wss.broadcast = function(data) {
        wss.clients.forEach(function(client) {
            client.send(data);
        });
    };

    wss.on('connection', function(ws) {
        ws.send(JSON.stringify({
            id: 'init',
            playing: $rootScope.isSongPlaying,
            queue: queue,
            position: queueService.currentPosition,
            progress: (elPlayer.currentTime / elPlayer.duration) * 100
        }));

        ws.on('message', function(message) {
            switch (message) {
                case 'playpause':
                    if ($rootScope.isSongPlaying) {
                        playerService.pauseSong();
                    } else {
                        playerService.playSong();
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

    elPlayer.onloadeddata = function() {
        if ($rootScope.isSongPlaying) {
            wss.broadcast(JSON.stringify({
                id: 'position',
                position: queueService.currentPosition
            }));
        }
    }

    elPlayer.onplay = function() {
        wss.broadcast(JSON.stringify({
            id: 'playing',
            playing: true
        }));
    }

    elPlayer.onpause = function() {
        wss.broadcast(JSON.stringify({
            id: 'playing',
            playing: false
        }));
    }

    server.listen(8319);
});
