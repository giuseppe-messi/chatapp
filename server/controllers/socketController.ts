import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";
import { randomUUID } from "node:crypto";
import type { PrismaClient } from "@prisma/client/extension";

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

    socket.on("dm:join", (peerId: string, ack?: (room: string) => void) => {
      const room = dmRoomId(userId, peerId);
      socket.join(room);
      ack?.(room);
      console.log("joined room!");
    });

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

          // persist to DB here if you want
          const msg = {
            id: randomUUID(),
            room,
            from: await getUserInfoForDm(userId, prisma),
            to: await getUserInfoForDm(to, prisma),
            text,
            createdAt: Date.now()
          };

          console.log("🚀 ~ msg:", msg);

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
