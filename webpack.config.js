if (!process.env.NODE_ENV) {
  console.log('NODE_ENV not set, using dotenv');
  require('dotenv').config();
}
const path = require('path'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin');
console.log(path.resolve(__dirname, 'src'));
module.exports = {
  mode: process.env.NODE_ENV,
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
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },

  optimization: {
    splitChunks: {
      chunks: 'all'
    }
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
