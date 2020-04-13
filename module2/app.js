// Core modules
const http = require('http');
// Custom Files
const routes = require('./route');

const server = http.createServer(routes.handler);

console.log('Start server');
console.log('Nodemon runnning');

server.listen(8000);
