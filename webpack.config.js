var path = require('path');

module.exports = {
    // Gives you sourcemaps without slowing down rebundling
    devtool: 'eval-source-map',
    entry: path.join(__dirname, './app/public/js/main.jsx'),
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
                loader: 'babel',
                query: {
                    presets: [
                        'es2015',
                        'react'
                    ]
                }
            }
        ]
    }
};