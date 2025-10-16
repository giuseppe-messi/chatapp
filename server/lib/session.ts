import crypto from "node:crypto";
import type { User } from "../generated/prisma/index.js";
import type { PrismaClientType } from "../types/prisma.js";

const newToken = () => crypto.randomBytes(32).toString("base64url");

export const hashed = (input: string) =>
  crypto.createHash("sha256").update(input).digest("base64url");

export const createSession = async (user: User, prisma: PrismaClientType) => {
  const token = newToken();
  const secretHash = hashed(token);

  await prisma.session.create({
    data: {
      userId: user.id,
      secretHash
    }
  });

  return {
    token
  };
};
