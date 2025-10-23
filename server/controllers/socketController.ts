import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";
import { randomUUID } from "node:crypto";
import type { PrismaClient } from "@prisma/client/extension";
import { getMessages, saveMessage, type MessageDoc } from "../mongo.js";

const dmRoomId = (userIdA: string, userIdB: string) =>
  ["dm", ...[userIdA, userIdB].sort()].join("::");

const userInfoForMessageCache = new Map();
const onlineUsersIds: Set<string> = new Set();

console.log("🚀 ~ userInfoForMessageCache:", userInfoForMessageCache);

const getUserInfoForDm = async (userId: string, prisma: PrismaClient) => {
  const cached = userInfoForMessageCache.get(userId);

  if (cached) return cached;

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!user) return;

  const userInfo = {
    userId: user.id,
    name: user.firstName,
    avatar: user.avatar,
    avatarBG: user.avatarBG
  };

  userInfoForMessageCache.set(userId, userInfo);

  return userInfo;
};

export const socketController = (server: HttpServer, prisma: PrismaClient) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"]
    }
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    // auth user here properly later, but for now
    const userId = socket.handshake.auth?.userId;
    if (!userId) {
      socket.disconnect(true);
      return;
    }

    onlineUsersIds.add(userId);
    io.emit("online-users", [...onlineUsersIds]);

    // broadcast online users here
    socket.on(
      "dm:join",
      async (peerId: string, ack?: (room: string, messages: any) => void) => {
        const room = dmRoomId(userId, peerId);
        socket.join(room);
        const messages = await getMessages(room);

        ack?.(room, messages);

        console.log("joined room!");
      }
    );

    socket.on("dm:leave", (peerId: string) => {
      const room = dmRoomId(userId, peerId);
      socket.leave(room);
      console.log("left room!");
    });

    socket.on(
      "dm:send",
      async (
        to: string,
        text: string,
        ack?: (res: { ok: boolean; msg?: any; error?: string }) => void
      ) => {
        try {
          const room = dmRoomId(userId, to);

          const fromDmInfo = await getUserInfoForDm(userId, prisma);
          const toDmInfo = await getUserInfoForDm(to, prisma);

          if (!fromDmInfo || !toDmInfo) throw new Error("Users not found!");

          // persist to DB
          const saved = await saveMessage({
            room,
            from: userId,
            to,
            text,
            createdAt: new Date()
          });

          // const convertDbMessageToUiDm = (dbMessage: Required<MessageDoc>) => {
          //   return {
          //     id: dbMessage._id.toString() ?? randomUUID(),
          //     room,
          //     from: fromDmInfo,
          //     to: toDmInfo,
          //     text,
          //     createdAt: dbMessage.createdAt
          //   };
          // };

          const msg = {
            id: saved._id.toString() ?? randomUUID(),
            room,
            from: fromDmInfo,
            to: toDmInfo,
            text,
            createdAt: saved.createdAt
          };

          // Emit to the shared DM room
          // both sides receive the same event
          io.emit("dm:message", msg);

          ack?.({ ok: true, msg });
        } catch (e: any) {
          ack?.({ ok: false, error: e?.message ?? "send failed" });
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("a user disconnected");
      onlineUsersIds.delete(userId);
      io.emit("online-users", [...onlineUsersIds]);
    });
  });
};
