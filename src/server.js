const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || '1234';
app.use(express.static('dist'));
app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port);
console.log('listening on ' + port);
