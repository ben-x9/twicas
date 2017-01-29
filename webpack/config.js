var path = require('path');
var webpack = require('webpack');

module.exports = {

  entry: {
    index: ['./app/core/start'],
  },
  output: {
    publicPath: '/',
    filename: 'bundle.js',
  },
  externals: {
    'firebase': 'firebase',
    'immutable': 'immutable',
    'lodash': '_',
    'jsondiffpatch': 'jsondiffpatch',
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
    root: [path.resolve('./app')]
  },
  devtool: '#eval',
  module: {
    loaders: [{
      test: /\.ts$/,
      loader: 'ts-loader',
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }],
  },
  ts: {
    transpileOnly: true,
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV'])
  ],
  devServer: {
    debug: true,
    devtool: 'cheap-module-eval-source-map',
    host: '0.0.0.0',
  }
};