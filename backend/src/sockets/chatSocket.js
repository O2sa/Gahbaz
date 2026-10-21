import { verifyJWT } from "../core/utils/token.utils.js";

export const setupChatSocket = (io) => {
  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.cookie
        ?.split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = verifyJWT(token);
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    // Automatically join personal user room for targeted notifications
    if (socket.userId) {
      socket.join(socket.userId);
    }

    socket.on("setup", (userData) => {
      if (userData?._id) {
        socket.join(userData._id);
        socket.emit("connected");
      }
    });

    socket.on("join chat", (room) => {
      if (room) {
        socket.join(room);
      }
    });

    socket.on("new message", (newMessageRecieved) => {
      if (!newMessageRecieved?.chatId) return;
      socket
        .in(newMessageRecieved.chatId)
        .emit("message recieved", newMessageRecieved);
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        socket.leave(socket.userId);
      }
    });
  });
};
