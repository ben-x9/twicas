var path = require('path');
var webpack = require('webpack');

const index = path.resolve(__dirname, 'test.js')

module.exports = {
  entry: {
    index: ['./webpack/test.js'],
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
    port: '8081',
  }
};