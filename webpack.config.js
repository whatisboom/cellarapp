if (!process.env.NODE_ENV) {
  console.log('NODE_ENV not set, using dotenv');
  require('dotenv').config();
}
const path = require('path'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin');

const entryFiles = ['@babel/polyfill', './src/index.tsx'];
if (process.env.NODE_ENV === 'development') {
  entryFiles.push('webpack-hot-middleware/client');
}

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    app: entryFiles
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
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ts|tsx)$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          plugins: [
            'transform-inline-environment-variables',
            'transform-class-properties',
            '@babel/plugin-syntax-dynamic-import',
            'react-hot-loader/babel'
          ],
          presets: [
            '@babel/react',
            '@babel/typescript',
            ['@babel/env', { modules: false }]
          ]
        }
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
