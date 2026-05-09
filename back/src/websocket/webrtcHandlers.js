const WebSocket = require("ws");

function forwardToOtherUser({ ws, rooms, message }) {
  const roomId = ws.roomId;

  if (!roomId || !rooms[roomId]) return;

  rooms[roomId].forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function handleWebRTCOffer({ ws, rooms, message }) {
  forwardToOtherUser({ ws, rooms, message });
}

function handleWebRTCAnswer({ ws, rooms, message }) {
  forwardToOtherUser({ ws, rooms, message });
}

function handleWebRTCIceCandidate({ ws, rooms, message }) {
  forwardToOtherUser({ ws, rooms, message });
}

module.exports = {
  handleWebRTCOffer,
  handleWebRTCAnswer,
  handleWebRTCIceCandidate,
};
