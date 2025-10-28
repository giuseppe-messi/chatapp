import type { Express } from "express";
import type { PrismaClientType } from "../types/prisma.js";
import { hashed } from "../lib/session.js";
import { SESSION_TOKEN_COOKIE } from "../lib/shared.js";
import { prisma } from "../db/prisma.js";

export const sessionController = (app: Express) => {
  app.get("/session", async (req, res) => {
    const sessionCookie = req.cookies[SESSION_TOKEN_COOKIE];

    if (!sessionCookie)
      return res.status(401).json({ message: "Unauthenticated" });

    try {
      const session = await prisma.session.findUnique({
        where: { secretHash: hashed(sessionCookie) },
        include: { user: true }
      });

      if (!session) {
        return res.status(401).json({ message: "Unauthenticated" });
      }

      return res.status(200).json(session.user);
    } catch (err) {
      if (err) res.status(500).json({ error: "Something went wrong!" });
    }
  });
};
