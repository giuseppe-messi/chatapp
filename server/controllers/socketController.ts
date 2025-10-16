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

    socket.on("join_room", (room) => {
      console.log(":::::: ", room);
      socket.join("room1");
      console.log(`Socket ${socket.id} joined room1`);
    });

    socket.on("send_message", (msg) => {
      console.log("message: " + msg.message);
    });
  });
};
