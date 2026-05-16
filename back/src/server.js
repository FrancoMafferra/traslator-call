const http = require("http");
require("dotenv").config();

const app = require("./app");
const setupWebSocketServer = require("./websocket/websocketServer");

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

const { warmupTranslations } = require("./services/translationService");

setupWebSocketServer(server);

server.listen(PORT, "0.0.0.0", async () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  await warmupTranslations();
});
