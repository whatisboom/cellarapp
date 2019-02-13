if (!process.env.NODE_ENV) {
  console.log('NODE_ENV not set, using dotenv');
  require('dotenv').config();
}
const cluster = require('cluster');
const os = require('os');
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || '1234';
const NODE_ENV = process.env.NODE_ENV;
const threads = parseInt(process.env.WEB_CONCURRENCY) || os.cpus().length || 1;
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  // Fork Workers.
  for (let i = 0; i < threads; i++) {
    cluster.fork();
  }
  console.log(`Server is listening on ${port}`);
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died: ${code}`);
  });
} else {
  console.log(process.env.NODE_ENV);
  if (NODE_ENV === 'development') {
    const webpack = require('webpack');
    const webpackConfig = require('../webpack.config');
    const compiler = webpack(webpackConfig);

    app.use(
      require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
      })
    );
    app.use(require('webpack-hot-middleware')(compiler));
  }
  app.use(express.static('dist'));

  app.use('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
  });

  app.listen(port);
  console.log(`Worker ${process.pid} started`);
}
