const path = require('path');
const express = require('express');
const server = require('http').createServer();
const app = express();

app.use('/', express.static(path.join(__dirname, 'build')));

server.on('request', app);
server.listen(4444, () => {
  console.log('Server Booted on Port 4444');
});