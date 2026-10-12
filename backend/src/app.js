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
import swaggerRouter, { openApiSpec } from "./docs/swagger.js";

import { authenticateUser } from "./core/middleware/auth.middleware.js";
import { enforceDemoReadOnly } from "./core/middleware/rbac.middleware.js";
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

// OpenAPI / Swagger Documentation
app.get("/api/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json(openApiSpec);
});
app.use("/api/docs", swaggerRouter);

// Health test route
app.get("/api/v1/test", (req, res) => {
  sendSuccess(res, { status: "healthy", timestamp: new Date().toISOString() });
});

// Unauthenticated Auth Router
app.use("/api/v1/auth", authRouter);

// Centralized authenticated pipeline: authentication + global demo read-only guard
const authGuard = [authenticateUser, enforceDemoReadOnly];

// Authenticated Domain Routers
app.use("/api/v1/users", authGuard, usersRouter);
app.use("/api/v1/colleges", authGuard, collegesRouter);
app.use("/api/v1/majors", authGuard, majorsRouter);
app.use("/api/v1/subjects", authGuard, subjectsRouter);
app.use("/api/v1/semesters", authGuard, semestersRouter);
app.use("/api/v1/courses", authGuard, coursesRouter);
app.use("/api/v1/grades", authGuard, gradesRouter);
app.use("/api/v1/students", authGuard, studentsRouter);
app.use("/api/v1/teachers", authGuard, teachersRouter);
app.use("/api/v1/admins", authGuard, adminsRouter);
app.use("/api/v1/chats", authGuard, chatRouter);
app.use("/api/v1/messages", authGuard, messagesRouter);
app.use("/api/v1/system", authGuard, systemRouter);

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
