import "express-async-errors";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import path from "node:path";
import { fileURLToPath } from "node:url";

import authRouter from "./modules/auth/auth.routes.js";
import usersRouter, { legacyAuRouter } from "./modules/users/users.routes.js";
import academicsRouter from "./modules/academics/academics.routes.js";
import chatRouter, { messagesRouter } from "./modules/chat/chat.routes.js";
import systemRouter from "./modules/system/system.routes.js";

import { authenticateUser } from "./core/middleware/auth.middleware.js";
import errorHandlerMiddleware from "./core/middleware/error.middleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(mongoSanitize());

// Static file serving for images
app.use("/images", express.static(path.resolve(__dirname, "../../images")));

// Health test route
app.get("/api/v1/test", (req, res) => {
  res.status(200).json({ msg: "test route" });
});

// Unauthenticated Auth Router
app.use("/api/v1/auth", authRouter);

// Authenticated Domain Routers
app.use("/api/v1/users", authenticateUser, usersRouter);
app.use("/api/v1/au", authenticateUser, legacyAuRouter);
app.use("/api/v1", authenticateUser, academicsRouter);
app.use("/api/v1/chats", authenticateUser, chatRouter);
app.use("/api/v1/messages", authenticateUser, messagesRouter);
app.use("/api/v1/system", authenticateUser, systemRouter);

// Serve frontend in production
const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));

app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ msg: "not found" });
  }
  res.sendFile(path.resolve(clientDist, "index.html"), (err) => {
    if (err) next();
  });
});

// Global 404 for unknown endpoints
app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

// Centralized Global Error Handler
app.use(errorHandlerMiddleware);

export default app;
