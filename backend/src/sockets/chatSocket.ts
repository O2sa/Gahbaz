import { Server, Socket } from "socket.io";
import { verifyJWT } from "../core/utils/token.utils.js";

export interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const setupChatSocket = (io: Server): void => {
  // Middleware to authenticate socket connections
  io.use((socket: Socket, next: (err?: Error) => void) => {
    const authSocket = socket as AuthenticatedSocket;
    const token =
      authSocket.handshake.auth?.token ||
      authSocket.handshake.headers?.cookie
        ?.split("; ")
        .find((row: string) => row.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = verifyJWT(token);
      authSocket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;

    // Automatically join personal user room for targeted notifications
    if (authSocket.userId) {
      authSocket.join(authSocket.userId);
    }

    authSocket.on("setup", (userData: { _id?: string }) => {
      if (userData?._id) {
        authSocket.join(userData._id);
        authSocket.emit("connected");
      }
    });

    authSocket.on("join chat", (room: string) => {
      if (room) {
        authSocket.join(room);
      }
    });

    authSocket.on("new message", (newMessageRecieved: { chatId?: string; [key: string]: any }) => {
      if (!newMessageRecieved?.chatId) return;
      authSocket
        .in(newMessageRecieved.chatId)
        .emit("message recieved", newMessageRecieved);
    });

    authSocket.on("disconnect", () => {
      if (authSocket.userId) {
        authSocket.leave(authSocket.userId);
      }
    });
  });
};

export default setupChatSocket;
