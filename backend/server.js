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
  server.listen(env.PORT, () => {
    console.log(`[Server] Gahbaz backend running in ${env.NODE_ENV} mode on port ${env.PORT}...`);
    console.log(`[Docs] Swagger UI available at: http://localhost:${env.PORT}/api/docs`);
    console.log(`[Docs] Raw OpenAPI JSON at: http://localhost:${env.PORT}/api/docs.json`);
  });

  try {
    console.log("[Database] Connecting to MongoDB...");
    await mongoose.connect(env.MONGO_URL, { serverSelectionTimeoutMS: 5000 });
    console.log("[Database] Connected successfully to MongoDB");
  } catch (dbError) {
    console.warn(`[Database] MongoDB connection notice: ${dbError.message}`);
    console.warn("[Database] Endpoints not requiring MongoDB (e.g. /api/docs, /api/v1/test) are fully operational.");
  }
};

// Graceful shutdown
const shutdown = async () => {
  console.log("\n[Server] Gracefully shutting down...");
  server.close(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    console.log("[Server] Closed HTTP server and connections.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

start();

export { app, server, io };
