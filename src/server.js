const express = require('express');
const path = require('path');

const webpack = require('webpack');
const webpackConfig = require('../webpack.config');
const compiler = webpack(webpackConfig);

const app = express();
const port = process.env.PORT || '1234';

app.use(
  require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  })
);
app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static('dist'));

app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port);
console.log('listening on ' + port);
