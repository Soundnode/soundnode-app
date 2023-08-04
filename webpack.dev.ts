'use strict';

import * as path from 'path';
import * as webpack from 'webpack';

const config: webpack.Configuration = {
  target: 'node',
  devtool: 'eval',
  entry: path.join(__dirname, './app/public/js/components/main.jsx'),
  output: {
    path: path.join(__dirname, './app/dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          'babel-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  externals: [
    (() => {
      const IGNORES: string[] = [
        'electron'
      ];
      return (context: any, request: any, callback: any) => {
        if (IGNORES.indexOf(request) >= 0) {
          return callback(null, `require('${request}')`);
        }
        return callback();
      };
    })()
  ]
};

export default config;