const WebSocket = require('ws');

function handleAudioChunk({ ws, rooms, message }) {
  const roomId = ws.roomId;

  if (!roomId || !rooms[roomId]) return;

  rooms[roomId].forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: 'AUDIO_CHUNK',
          audio: message.audio,
        })
      );
    }
  });
}

module.exports = {
  handleAudioChunk,
};