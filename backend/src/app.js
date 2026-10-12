import "express-async-errors";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import path from "node:path";
import { fileURLToPath } from "node:url";

import authRouter from "./modules/auth/auth.routes.js";
import usersRouter from "./modules/users/users.routes.js";
import collegesRouter from "./modules/colleges/colleges.routes.js";
import majorsRouter from "./modules/majors/majors.routes.js";
import subjectsRouter from "./modules/subjects/subjects.routes.js";
import semestersRouter from "./modules/semesters/semesters.routes.js";
import coursesRouter from "./modules/courses/courses.routes.js";
import gradesRouter from "./modules/grades/grades.routes.js";
import studentsRouter from "./modules/students/students.routes.js";
import teachersRouter from "./modules/teachers/teachers.routes.js";
import adminsRouter from "./modules/admins/admins.routes.js";
import chatRouter, { messagesRouter } from "./modules/chat/chat.routes.js";
import systemRouter from "./modules/system/system.routes.js";

import { authenticateUser } from "./core/middleware/auth.middleware.js";
import errorHandlerMiddleware from "./core/middleware/error.middleware.js";
import { sendSuccess } from "./core/utils/response.utils.js";

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
  sendSuccess(res, { status: "healthy", timestamp: new Date().toISOString() });
});

// Unauthenticated Auth Router
app.use("/api/v1/auth", authRouter);

// Authenticated Domain Routers
app.use("/api/v1/users", authenticateUser, usersRouter);
app.use("/api/v1/colleges", authenticateUser, collegesRouter);
app.use("/api/v1/majors", authenticateUser, majorsRouter);
app.use("/api/v1/subjects", authenticateUser, subjectsRouter);
app.use("/api/v1/semesters", authenticateUser, semestersRouter);
app.use("/api/v1/courses", authenticateUser, coursesRouter);
app.use("/api/v1/grades", authenticateUser, gradesRouter);
app.use("/api/v1/students", authenticateUser, studentsRouter);
app.use("/api/v1/teachers", authenticateUser, teachersRouter);
app.use("/api/v1/admins", authenticateUser, adminsRouter);
app.use("/api/v1/chats", authenticateUser, chatRouter);
app.use("/api/v1/messages", authenticateUser, messagesRouter);
app.use("/api/v1/system", authenticateUser, systemRouter);

// Serve frontend in production if built
const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));

app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: `API route ${req.originalUrl} not found` },
    });
  }
  res.sendFile(path.resolve(clientDist, "index.html"), (err) => {
    if (err) next();
  });
});

// Global 404 for unmatched routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Resource not found" },
  });
});

// Centralized Global Error Handler
app.use(errorHandlerMiddleware);

export default app;
