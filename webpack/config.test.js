var path = require('path');
var webpack = require('webpack');
// var nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
    root: [path.resolve('./app')]
  },
  devtool: '#eval',
  module: {
    loaders: [{
      test: /\.ts$/,
      loader: 'ts-loader',
      // exclude: /node_modules/,
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
    devtool: 'cheap-module-eval-source-map'
  }
};