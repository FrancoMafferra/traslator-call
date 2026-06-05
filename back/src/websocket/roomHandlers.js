const generateRoomId = require("../utils/generateRoomId");
const { translateText } = require("../services/translationService");

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

async function handleSpeechText({ ws, rooms, message }) {
  const messageId = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  const pipelineLabel = `[PIPELINE ${messageId}]`;
  console.time(pipelineLabel);

  const roomId = ws.roomId;

  if (!roomId || !rooms[roomId]) {
    console.log("[SPEECH_IGNORED]", {
      messageId,
      reason: "room_not_found",
      roomId,
      text: message.text,
    });

    console.timeEnd(pipelineLabel);
    return;
  }

  const sourceLanguage =
    message.fromLanguage || ws.languageConfig?.spokenLanguage || "en";

  console.log("[SPEECH_RECEIVED]", {
    messageId,
    roomId,
    text: message.text,
    sourceLanguage,
    senderConfig: ws.languageConfig,
    usersInRoom: rooms[roomId].length,
  });

  const recipients = rooms[roomId].filter((client) => {
    return client !== ws && client.readyState === 1;
  });

  if (recipients.length === 0) {
    console.log("[TRANSLATION_SKIPPED]", {
      messageId,
      reason: "no_available_recipients",
      roomId,
    });

    console.timeEnd(pipelineLabel);
    return;
  }

  await Promise.all(
    recipients.map(async (client) => {
      const targetLanguage =
        client.languageConfig?.listenLanguage || "en";

      console.log("[TRANSLATION_START]", {
        messageId,
        text: message.text,
        sourceLanguage,
        targetLanguage,
        receptorConfig: client.languageConfig,
      });

      const translatedText =
        sourceLanguage === targetLanguage
          ? message.text
          : await translateText({
              text: message.text,
              sourceLanguage,
              targetLanguage,
            });

      console.log("[TRANSLATION_DONE]", {
        messageId,
        originalText: message.text,
        translatedText,
        sourceLanguage,
        targetLanguage,
      });

      client.send(
        JSON.stringify({
          type: "TRANSLATED_TEXT",
          messageId,
          originalText: message.text,
          translatedText,
          fromLanguage: sourceLanguage,
          targetLanguage,
        }),
      );

      console.log("[TRANSLATED_TEXT_SENT]", {
        messageId,
        roomId,
        targetLanguage,
      });
    }),
  );

  console.timeEnd(pipelineLabel);
}

module.exports = {
  handleCreateRoom,
  handleJoinRoom,
  handleLanguageConfig,
  handleDisconnect,
  handleSpeechText,
};
