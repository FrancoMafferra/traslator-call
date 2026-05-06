const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();

app.use(cors());

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('User connected');

  ws.send(
    JSON.stringify({
      type: 'CONNECTED',
      message: 'Connected to server',
    })
  );

  ws.on('message', (message) => {
    console.log('Received:', message.toString());

    ws.send(
      JSON.stringify({
        type: 'MESSAGE',
        payload: message.toString(),
      })
    );
  });

  ws.on('close', () => {
    console.log('User disconnected');
  });
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});