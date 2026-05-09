const generateRoomId = require("../utils/generateRoomId");

function handleCreateRoom({ ws, rooms }) {
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
}

function handleJoinRoom({ ws, rooms, message }) {
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
}

function handleLanguageConfig({ ws, message }) {
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
}

function handleDisconnect({ ws, rooms }) {
  const roomId = ws.roomId;

  if (!roomId || !rooms[roomId]) return;

  rooms[roomId] = rooms[roomId].filter((client) => client !== ws);

  if (rooms[roomId].length === 0) {
    delete rooms[roomId];
  }

  console.log(`Usuario desconectado de ${roomId}`);
}

function handleSpeechText({ ws, rooms, message }) {
  const roomId = ws.roomId;

  if (!roomId || !rooms[roomId]) return;

  rooms[roomId].forEach((client) => {
    if (client !== ws && client.readyState === 1) {
      client.send(
        JSON.stringify({
          type: "SPEECH_TEXT",
          text: message.text,
          fromLanguage: message.fromLanguage,
        }),
      );
    }
  });
}

module.exports = {
  handleCreateRoom,
  handleJoinRoom,
  handleLanguageConfig,
  handleDisconnect,
  handleSpeechText,
};
