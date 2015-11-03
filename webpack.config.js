var path = require('path');

module.exports = {
    entry: path.join(__dirname, './app/public/js/components/main.jsx'),
    output: {
        path: path.join(__dirname, './app/dist'),
        filename: 'bundle.js', // or [name]
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        'es2015',
                        'stage-0', // this enable JS.next features in stage-0
                        'react'
                    ]
                }
            }
        ]
    },
    resolve: {
        modulesDirectories: [
            'node_modules'
        ]
    }
};