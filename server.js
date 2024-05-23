import "express-async-errors";
import * as dotenv from "dotenv";

dotenv.config();
import express from "express";
const app = express();

import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import fileUpload from "express-fileupload";
import rateLimiter from "express-rate-limit";
import xss from "xss-clean";
import cors from "cors";

// database
import connectDB from "./configs/connect.js";

//  routers
import studentRouter from "./routes/studentRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import teacherRouter from "./routes/teacherRoutes.js";
import collageRouter from "./routes/collageRoutes.js";
import subjectRouter from "./routes/subjectRoutes.js";
import semesterRouter from "./routes/semesterRoutes.js";
import courseRouter from "./routes/courseRoutes.js";
import sectionRouter from "./routes/sectionRoutes.js";
import gradeRouter from "./routes/gradeRoutes.js";
import majorRouter from "./routes/majorRoutes.js";
import semesterTemplateRoute from "./routes/semesterTemplateRoutes.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

// public
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import {
  authenticateUser,
  authorizePermissions,
} from "./middleware/authMiddleware.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// app.set('trust proxy', 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 60,
//   })
// );

app.use(express.static(path.resolve(__dirname, "./client/dist")));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "test route" });
});

//setup apis
app.use("/api/v1/users", authenticateUser, userRouter);
app.use("/api/v1/students", authenticateUser, studentRouter);
app.use("/api/v1/teachers", authenticateUser, teacherRouter);
app.use("/api/v1/admins", authenticateUser, adminRouter);
app.use("/api/v1/collages", authenticateUser, collageRouter);
app.use("/api/v1/courses", authenticateUser, courseRouter);
app.use("/api/v1/grades", authenticateUser, gradeRouter);
app.use("/api/v1/sections", authenticateUser, sectionRouter);
app.use("/api/v1/semesters", authenticateUser, semesterRouter);
app.use("/api/v1/majors", authenticateUser, majorRouter);
app.use("/api/v1/subjects", authenticateUser, subjectRouter);
app.use("/api/v1/semester-templates", authenticateUser, semesterTemplateRoute);
app.use("/api/v1/auth", authRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 6000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
