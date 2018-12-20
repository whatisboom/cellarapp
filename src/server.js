const express = require('express');
const path = require('path');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || '1234';

app.use(morgan('dev'));
app.use(express.static('dist'));
app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port);
console.log('listening on ' + port);
