import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";
import { randomUUID } from "node:crypto";
import type { PrismaClient } from "@prisma/client/extension";

const dmRoomId = (userIdA: string, userIdB: string) =>
  ["dm", ...[userIdA, userIdB].sort()].join("::");

const dmUserInfoCache = new Map();

console.log("🚀 ~ dmUserInfoCache:", dmUserInfoCache);

const getUserInfoForDm = async (userId: string, prisma: PrismaClient) => {
  const cached = dmUserInfoCache.get(userId);

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

  dmUserInfoCache.set(userId, userInfo);

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

    // broadcast online users here

    socket.on("dm:join", ({ peerId }: { peerId: string }) => {
      const room = dmRoomId(userId, peerId);
      socket.join(room);
      console.log("joined room!");
    });

    socket.on("dm:leave", ({ peerId }: { peerId: string }) => {
      const room = dmRoomId(userId, peerId);
      socket.leave(room);
      console.log("left room!");
    });

    socket.on(
      "dm:send",
      async (
        { to, text }: { to: string; text: string },
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

          // Emit to the shared DM room so both sides receive the same event
          io.to(room).emit("dm:message", msg);

          ack?.({ ok: true, msg });
        } catch (e: any) {
          ack?.({ ok: false, error: e?.message ?? "send failed" });
        }
      }
    );

    socket.on("disconnect", (socket) => {
      console.log("a user disconnected");
    });
  });
};
