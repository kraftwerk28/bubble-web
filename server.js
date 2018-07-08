'use strict';

const fs = require('fs');

require('http').createServer((req, res) => {
  const p = req.url === '/' ? 'index.html' : req.url.slice(1);
  fs.readFile(p, (e, d) => { res.end(d) });
}).listen(8080);
