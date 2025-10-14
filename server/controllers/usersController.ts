import type { DefaultArgs } from "@prisma/client/runtime/binary";
import { Prisma, type PrismaClient } from "../generated/prisma/index.js";
import type { Express } from "express";
import * as z from "zod";

type PrismaClientType = PrismaClient<
  Prisma.PrismaClientOptions,
  never,
  DefaultArgs
>;

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 20;

const UserQuery = z.object({
  filterByName: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE)
  // sortBy: z.enum(['firstName'])
});

export const usersController = (app: Express, prisma: PrismaClientType) => {
  app.get("/users", async (req, res) => {
    const parsed = UserQuery.safeParse(req.query);

    if (!parsed.success)
      return res.status(400).json({ error: "Invalid params!" });

    const { filterByName, page, pageSize } = parsed.data;

    const where: Prisma.UserWhereInput = filterByName
      ? {
          firstName: {
            contains: filterByName,
            mode: "insensitive"
          }
        }
      : {};
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    try {
      const [items, total] = await prisma.$transaction([
        prisma.user.findMany({
          where,
          skip,
          take
        }),
        prisma.user.count()
      ]);

      res.status(200).json({
        page,
        pageSize,
        hasMore: skip + items.length < total,
        items
      });
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
