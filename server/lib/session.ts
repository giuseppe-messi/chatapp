import crypto from "node:crypto";
import type { User } from "../generated/prisma/index.js";
import type { PrismaClientType } from "../types/prisma.js";

export const SESSION_TOKEN_COOKIE = "chatapp-session-token";
export const SESSION_TTL_SEC = 60 * 60 * 24; // 1 day

const newToken = () => crypto.randomBytes(32).toString("base64url");

export const hashed = (input: string) =>
  crypto.createHash("sha256").update(input).digest("base64url");

export const createSession = async (user: User, prisma: PrismaClientType) => {
  const token = newToken();
  const secretHash = hashed(token);
  const now = new Date();

  await prisma.session.create({
    data: {
      userId: user.id,
      secretHash,
      expiresAt: new Date(now.getTime() + SESSION_TTL_SEC * 1000)
    }
  });

  return {
    token
  };
};
