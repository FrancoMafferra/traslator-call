const http = require('http');
require('dotenv').config();

const app = require('./app');
const setupWebSocketServer = require('./websocket/websocketServer');

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

setupWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});