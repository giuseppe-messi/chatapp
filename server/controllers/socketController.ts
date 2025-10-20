import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";

export const socketController = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"]
    }
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    const userId = socket.handshake.auth.userId; // get this from a real auth token in production
    console.log("userId: ", userId);

    socket.join(`user:${userId}`);

    socket.on("dm:send", async ({ toUserId, text, threadId }) => {
      // 1) persist to DB
      // const msg = await saveMessage({
      //   from: userId,
      //   to: toUserId,
      //   threadId,
      //   text
      // });

      console.log("text: ", text);

      // 2) deliver to recipient on all devices
      io.to(`user:${toUserId}`).emit("dm:new", text);

      // 3) echo back to sender so their UI updates immediately
      io.to(`user:${userId}`).emit("dm:sent", text);
    });
  });

  io.on("disconnect", (socket) => {
    console.log("a user disconnected");
  });
};
