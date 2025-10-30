import { allowedOrigins } from "../app.js";
import { getMessages, saveMessage } from "../features/messages/messages.js";
import { prisma } from "../db/prisma.js";
import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";
import type { PrismaClient } from "@prisma/client/extension";
import type { Message } from "../db/mongo.js";

const dmRoomId = (userIdA: string, userIdB: string) =>
  ["dm", ...[userIdA, userIdB].sort()].join("::");

const userInfoForMessageCache = new Map();
const onlineUsersIds: Set<string> = new Set();

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

export const socketController = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true
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
      async (
        peerId: string,
        ack?: (room: string, messages: Message[]) => void
      ) => {
        const room = dmRoomId(userId, peerId);
        socket.join(room);

        // TODO: load bits at time
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
        ack?: (res: { ok: boolean; msg?: Message; error?: string }) => void
      ) => {
        try {
          const room = dmRoomId(userId, to);

          const fromDmInfo = await getUserInfoForDm(userId, prisma);
          const toDmInfo = await getUserInfoForDm(to, prisma);

          if (!fromDmInfo || !toDmInfo) throw new Error("Users not found!");

          // persist to DB
          const saved = await saveMessage({
            room,
            from: fromDmInfo,
            to: toDmInfo,
            text,
            createdAt: new Date()
          });

          // Emit to the shared DM room
          // both sides receive the same event
          io.emit("dm:message", saved);

          ack?.({ ok: true, msg: saved });
        } catch (e: unknown) {
          if (e instanceof Error)
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
