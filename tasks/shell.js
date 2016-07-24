module.exports = {
    options: {
        stdout: true
    },
    target: {
        command: function() {
            var webpack = 'node_modules/webpack/bin/webpack.js -p';
            var nw_gyp = 'node_modules/nw-gyp/bin/nw-gyp.js rebuild --directory=node_modules/mpris-service/node_modules/dbus --target=0.12.3';
            var export_py2 = 'export PYTHON=/usr/bin/python2';

            if("linux" === process.platform) {
                return [webpack, export_py2, nw_gyp].join(' && ');
            } else {
                return webpack;
            }
        }
    }
};
