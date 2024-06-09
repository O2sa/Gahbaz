import "express-async-errors";
import { Server } from "socket.io";
("socket.io");
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
import systemRouter from "./routes/systemRoutes.js";

import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messagesRoute.js";
import chatRoutes from "./routes/chatRoutes.js";

// public
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser, authorizePermissions } from "./middleware/authMiddleware.js";
import { activityLogger } from "./middleware/systemMiddleware.js";
import { collectAndStoreMetrics } from "./utils/dataCollector.js";

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
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "http://localhost:5000", "ws://localhost:5000"],
        // Add other directives as needed
      },
    },
  })
);

app.use(cors());
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "test route" });
});



app.use("/api/v1/auth", authRouter);

app.use(authenticateUser);



//setup apis
app.use("/api/v1/users", userRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/collages", collageRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/grades", gradeRouter);
app.use("/api/v1/sections", sectionRouter);
app.use("/api/v1/semesters", semesterRouter);
app.use("/api/v1/majors", majorRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/system", systemRouter);
app.use(
  "/api/v1/semester-templates",

  semesterTemplateRoute
);

app.use("/images", express.static("images"));
app.use("/api/v1/au", userRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/chats", chatRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 6000;

const server = app.listen(port, () =>
  console.log(`Server is listening on port ${port}...`)
);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
  } catch (error) {
    console.log(error);
  }
};

start();

const io = new Server(server, {
  cors: {
    // origin: "http://localhost:5173",
    credentials: true,
  },
});

//creating sockets
io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("contacts", (data) => {
    if (data) {
      socket.emit("contacts", data);
    }
  });
  socket.on("new message", (newMessageRecieved) => {
    socket
      .in(newMessageRecieved.chatId)
      .emit("message recieved", newMessageRecieved);
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

// console.log('EMAIL_USER:', process.env.EMAIL_USER);
// console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
setInterval(collectAndStoreMetrics, 100000); // Collect and store metrics every 10 seconds
