const WebSocket = require("ws");

const {
  handleCreateRoom,
  handleJoinRoom,
  handleLanguageConfig,
  handleDisconnect,
  handleSpeechText,
} = require("./roomHandlers");

const { handleAudioChunk } = require("./audioHandlers");

function setupWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  const rooms = {};

  wss.on("connection", (ws) => {
    console.log("Usuario conectado");

    ws.on("message", (data) => {
      const message = JSON.parse(data.toString());

      console.log("Mensaje:", message);

      switch (message.type) {
        case "CREATE_ROOM":
          handleCreateRoom({ ws, rooms });
          break;

        case "JOIN_ROOM":
          handleJoinRoom({ ws, rooms, message });
          break;

        case "SET_LANGUAGE_CONFIG":
          handleLanguageConfig({ ws, message });
          break;

        case "AUDIO_CHUNK":
          handleAudioChunk({ ws, rooms, message });
          break;

        case "SPEECH_TEXT":
          handleSpeechText({ ws, rooms, message });
          break;

        default:
          console.log("Tipo de mensaje no reconocido:", message.type);
      }
    });

    ws.on("close", () => {
      handleDisconnect({ ws, rooms });
    });
  });

  return wss;
}

module.exports = setupWebSocketServer;
