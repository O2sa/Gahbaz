import "express-async-errors";
import http from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";

import app from "./src/app.js";
import env from "./src/config/env.js";
import { setupChatSocket } from "./src/sockets/chatSocket.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

setupChatSocket(io);

const start = async () => {
  try {
    console.log("[Database] Connecting to MongoDB...");
    await mongoose.connect(env.MONGO_URL);
    console.log("[Database] Connected successfully to MongoDB");

    server.listen(env.PORT, () => {
      console.log(`[Server] Gahbaz backend running in ${env.NODE_ENV} mode on port ${env.PORT}...`);
    });
  } catch (error) {
    console.error("[Fatal Startup Error]", error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async () => {
  console.log("\n[Server] Gracefully shutting down...");
  server.close(async () => {
    await mongoose.connection.close();
    console.log("[Server] Closed HTTP server and MongoDB connections.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

start();

export { app, server, io };
