import type { DefaultArgs } from "@prisma/client/runtime/binary";
import { Prisma, type PrismaClient } from "../generated/prisma/index.js";
import type { Express } from "express";

type PrismaClientType = PrismaClient<
  Prisma.PrismaClientOptions,
  never,
  DefaultArgs
>;

export const usersController = (app: Express, prisma: PrismaClientType) => {
  app.get("/users", async (_, res) => {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (err) {
      if (err) res.status(500).json({ error: "Something went wrong!" });
    }
  });

  app.post("/users", async (req, res) => {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email)
      res.status(400).json({ error: "Bad request!" });

    const doesExist = await prisma.user.findUnique({ where: { email } });

    if (doesExist)
      res
        .status(409)
        .json({ error: "This email already exists! Try logging in!" });

    try {
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email
        }
      });

      res.status(201).json({
        ...user
      });
    } catch (err) {
      // if (err instanceof Prisma.PrismaClientKnownRequestError) {
      //   // have a bunch of these condition following
      //   // https://www.prisma.io/docs/orm/reference/error-reference
      //   res.status(500).json({ error: err.message });
      // }
      res.status(500).json({ error: err });
    }
  });

  app.delete("/user/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) res.status(400).json({ error: "A user id needs to be provided!" });

    try {
      await prisma.user.delete({
        where: {
          id
        }
      });

      res.status(204).end();
    } catch (err) {
      res.status(500).json({ error: err });
    }
  });
};
