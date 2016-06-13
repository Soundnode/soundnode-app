module.exports = {
    options: {
        stdout: true
    },
    target: {
        command: function() {
            if("linux" === process.platform) {
                return 'webpack -p && export PYTHON=/usr/bin/python2 && cd ./node_modules/mpris-service/node_modules/dbus && nw-gyp rebuild --target=0.12.3';
            } else {
                return 'webpack -p';
            }
        }
    }
};
