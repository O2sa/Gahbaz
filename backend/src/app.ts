import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import authRouter from "./modules/auth/auth.routes.js";
import usersRouter from "./modules/users/users.routes.js";
import collegesRouter from "./modules/colleges/colleges.routes.js";
import majorsRouter from "./modules/majors/majors.routes.js";
import subjectsRouter from "./modules/subjects/subjects.routes.js";
import semestersRouter from "./modules/semesters/semesters.routes.js";
import semesterTemplatesRouter from "./modules/semesters/semesterTemplates.routes.js";
import coursesRouter from "./modules/courses/courses.routes.js";
import assignmentsRouter from "./modules/assignments/assignments.routes.js";
import enrollmentRouter from "./modules/enrollment/enrollment.routes.js";
import sectionsRouter from "./modules/courses/sections.routes.js";
import gradesRouter from "./modules/grades/grades.routes.js";
import transcriptsRouter from "./modules/transcripts/transcripts.routes.js";
import studentsRouter from "./modules/students/students.routes.js";
import teachersRouter from "./modules/teachers/teachers.routes.js";
import adminsRouter from "./modules/admins/admins.routes.js";
import chatRouter, { messagesRouter } from "./modules/chat/chat.routes.js";
import systemRouter from "./modules/system/system.routes.js";
import mediaRouter from "./modules/media/media.routes.js";
import universitiesRouter from "./modules/universities/universities.routes.js";
import swaggerRouter, { openApiSpec } from "./docs/swagger.js";

import { authenticateUser } from "./core/middleware/auth.middleware.js";
import errorHandlerMiddleware from "./core/middleware/error.middleware.js";
import { sendSuccess } from "./core/utils/response.utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(mongoSanitize());

// Static file serving for images and uploads with CORS and cross-origin headers
const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");
const staticOptions = {
  setHeaders: (res: Response) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  },
};

app.use("/images", express.static(path.resolve(__dirname, "../../images"), staticOptions));
app.use("/uploads", express.static(uploadDir, staticOptions));

// Fallback resolver for /uploads in case a file was moved or stored in another subfolder
app.use("/uploads/:folder/:filename", (req: Request, res: Response, next: NextFunction) => {
  const { folder, filename } = req.params;
  const directPath = path.join(uploadDir, folder, filename);
  if (fs.existsSync(directPath)) {
    return res.sendFile(directPath);
  }
  const candidateFolders = ["general", "covers", "avatars", "videos", "attachments", "assignments"];
  for (const cand of candidateFolders) {
    const candPath = path.join(uploadDir, cand, filename);
    if (fs.existsSync(candPath)) {
      return res.sendFile(candPath);
    }
  }
  next();
});

// OpenAPI / Swagger Documentation
app.get("/api/docs.json", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.json(openApiSpec);
});
app.use("/api/docs", swaggerRouter);

// Health test route
app.get("/api/v1/test", (_req: Request, res: Response) => {
  sendSuccess(res, { status: "healthy", timestamp: new Date().toISOString() });
});

// Unauthenticated Auth Router
app.use("/api/v1/auth", authRouter);

// Centralized authenticated pipeline: authentication
const authGuard = [authenticateUser];

// Authenticated Domain Routers
app.use("/api/v1/users", authGuard, usersRouter);
app.use("/api/v1/colleges", authGuard, collegesRouter);
app.use("/api/v1/collages", authGuard, collegesRouter);
app.use("/api/v1/majors", authGuard, majorsRouter);
app.use("/api/v1/subjects", authGuard, subjectsRouter);
app.use("/api/v1/semesters", authGuard, semestersRouter);
app.use("/api/v1/semester-templates", authGuard, semesterTemplatesRouter);
app.use("/api/v1/courses", authGuard, coursesRouter);
app.use("/api/v1/sections", authGuard, sectionsRouter);
app.use("/api/v1/assignments", authGuard, assignmentsRouter);
app.use("/api/v1/enrollment", authGuard, enrollmentRouter);
app.use("/api/v1/grades", authGuard, gradesRouter);
app.use("/api/v1/transcripts", authGuard, transcriptsRouter);
app.use("/api/v1/students", authGuard, studentsRouter);
app.use("/api/v1/teachers", authGuard, teachersRouter);
app.use("/api/v1/admins", authGuard, adminsRouter);
app.use(["/api/v1/chats", "/api/v1/chat"], authGuard, chatRouter);
app.use("/api/v1/messages", authGuard, messagesRouter);
app.use("/api/v1/system", authGuard, systemRouter);
app.use("/api/v1/media", mediaRouter);
app.use("/api/v1/universities", universitiesRouter);

// Health check routes for Render, uptime monitors, and cloud probes
app.get(["/health", "/api/v1/health"], (_req: Request, res: Response) => {
  sendSuccess(res, {
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Root API information route
app.get("/", (_req: Request, res: Response) => {
  res.json({
    name: "Gahbaz Academic Platform API",
    status: "active",
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    docs: "/api/docs",
    health: "/health",
  });
});

// Global 404 for unmatched routes - Pure JSON API response (never serve frontend)
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `API route ${req.originalUrl} not found`,
    },
  });
});

// Centralized Global Error Handler
app.use(errorHandlerMiddleware);

export default app;
