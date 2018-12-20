require('dotenv').config();
const path = require('path'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    app: ['@babel/polyfill', './src/index.tsx']
  },
  output: {
    filename: '[name].[hash].js',
    path: __dirname + '/dist',
    publicPath: '/'
  },
  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'babel-loader'
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html')
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
