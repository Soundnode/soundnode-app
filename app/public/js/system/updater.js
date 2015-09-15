var EventEmitter = require("events").EventEmitter;
var updaterEvent = new EventEmitter();
var Download = require('download');

function getUrl() {
    var linux = process.platform == 'linux32' || process.platform == 'linux64' || process.platform == 'linux';
    var windows = process.platform == 'win32';
    var mac = process.platform == 'darwin';

    if (linux) {
        return 'http://www.soundnodeapp.com/downloads/linux/Soundnode-App.zip';
    } else if (windows) {
        return 'http://goo.gl/Y46Hn8';
    } else if (mac) {
        return 'http://goo.gl/wDlo2c';
    }
}

function getNewVersion(path) {

    updaterEvent.emit('started');

    new Download({
        mode: '777',
        extract: true
    })
        .get( getUrl() )
        .dest(path)
        .run(function (err, files) {
            if (err) {
                console.log(err);
                updaterEvent.emit('error');
            }

            updaterEvent.emit('done');
            console.log('File saved at:', path)
        });
}