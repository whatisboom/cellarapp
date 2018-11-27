const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;

// maps file extention to MIME types
const mimeType: { [ext: string]: string } = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.eot': 'appliaction/vnd.ms-fontobject',
  '.ttf': 'aplication/font-sfnt'
};
http
  .createServer(function(req: any, res: any) {
    console.log(`${req.method} ${req.url}`);
    // parse URL
    const parsedUrl = url.parse(req.url);
    // extract URL path
    // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
    // e.g curl --path-as-is http://localhost:8080/../fileInDanger.txt
    // by limiting the path to current directory only
    const sanitizePath = path
      .normalize(parsedUrl.pathname)
      .replace(/^(\.\.[\/\\])+/, '');
    let pathname = path.join(__dirname, sanitizePath);
    fs.exists(pathname, function(exist: boolean) {
      if (!exist) {
        pathname = path.resolve(__dirname, 'index.html');
      }
      // if is a directory, then look for index.html
      if (fs.statSync(pathname).isDirectory()) {
        pathname += '/index.html';
      }
      // read file from file system
      fs.readFile(pathname, function(err: Error, data: any) {
        if (err) {
          res.statusCode = 500;
          res.end(`Error getting the file: ${err}.`);
        } else {
          // based on the URL path, extract the file extention. e.g. .js, .doc, ...
          const ext = path.parse(pathname).ext;
          // if the file is found, set Content-type and send data
          res.setHeader('Content-type', mimeType[ext] || 'text/plain');
          res.end(data);
        }
      });
    });
  })
  .listen(port);
console.log(`Server listening on port ${port}`);
