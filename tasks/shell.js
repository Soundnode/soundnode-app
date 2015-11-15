module.exports = {
    options: {
        stdout: true
    },
    target: {
        command: 'webpack -p',
        command: function () {
            if("linux" === process.platform) {
                return 'cd ./node_modules/mpris-service/node_modules/dbus && nw-gyp rebuild --target=0.12.3';
            } else {
                return '';
            }
        }
    }
};
