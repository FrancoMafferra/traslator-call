const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const rooms = {};

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

wss.on("connection", (ws) => {
  console.log("Usuario conectado");

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());

    console.log("Mensaje:", message);

    switch (message.type) {
      case "CREATE_ROOM": {
        const roomId = generateRoomId();

        rooms[roomId] = [ws];

        ws.roomId = roomId;

        ws.send(
          JSON.stringify({
            type: "ROOM_CREATED",
            roomId,
          }),
        );

        console.log(`Sala creada: ${roomId}`);

        break;
      }

      case "JOIN_ROOM": {
        const { roomId } = message;

        if (!rooms[roomId]) {
          ws.send(
            JSON.stringify({
              type: "ERROR",
              message: "Sala no encontrada",
            }),
          );

          return;
        }

        if (rooms[roomId].length >= 2) {
          ws.send(
            JSON.stringify({
              type: "ERROR",
              message: "Sala llena",
            }),
          );

          return;
        }

        rooms[roomId].push(ws);

        ws.roomId = roomId;

        rooms[roomId].forEach((client) => {
          client.send(
            JSON.stringify({
              type: "USER_JOINED",
              roomId,
              users: rooms[roomId].length,
            }),
          );
        });

        console.log(`Usuario unido a sala ${roomId}`);

        break;
      }

      case "SET_LANGUAGE_CONFIG": {
        ws.languageConfig = {
          spokenLanguage: message.spokenLanguage,
          listenLanguage: message.listenLanguage,
        };

        ws.send(
          JSON.stringify({
            type: "LANGUAGE_CONFIG_SAVED",
            languageConfig: ws.languageConfig,
          }),
        );

        console.log("Configuración de idioma guardada:", ws.languageConfig);

        break;
      }

      case "AUDIO_CHUNK": {
        const roomId = ws.roomId;

        if (!roomId || !rooms[roomId]) return;

        rooms[roomId].forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: "AUDIO_CHUNK",
                audio: message.audio,
              }),
            );
          }
        });

        break;
      }
    }
  });

  ws.on("close", () => {
    const roomId = ws.roomId;

    if (roomId && rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((client) => client !== ws);

      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }

      console.log(`Usuario desconectado de ${roomId}`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
