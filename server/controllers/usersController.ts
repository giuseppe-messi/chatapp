import { Prisma } from "../generated/prisma/index.js";
import type { Express } from "express";
import * as z from "zod";
import type { PrismaClientType } from "../types/prisma.js";
import { createSession, hashed } from "../lib/session.js";
import { SESSION_TOKEN_COOKIE } from "../lib/shared.js";

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 20;

const GetUsersQuery = z.object({
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

const CreateUser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email()
});

const VerifyUser = z.object({
  email: z.email()
});

export const usersController = (app: Express, prisma: PrismaClientType) => {
  app.get("/users", async (req, res) => {
    const parsed = GetUsersQuery.safeParse(req.query);

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
    console.log(req.body);
    const parsed = CreateUser.safeParse(req.body);

    if (!parsed.success)
      return res.status(400).json({ error: "Invalid params!" });

    const { firstName, lastName, email } = req.body;

    try {
      const doesExist = await prisma.user.findUnique({ where: { email } });

      if (doesExist)
        res
          .status(409)
          .json({ message: "This email already exists! Try logging in!" });

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

  app.post("/user/signin", async (req, res) => {
    const parsed = VerifyUser.safeParse(req.body);

    if (!parsed.success)
      return res.status(400).json({ message: "Invalid params!" });

    const { email } = parsed.data;

    try {
      const user = await prisma.user.findUnique({
        where: {
          email
        }
      });

      if (!user)
        return res
          .status(409)
          .json({ message: "This email does not exists! Try registering!" });

      const { token } = await createSession(user, prisma);

      return res
        .status(200)
        .cookie(SESSION_TOKEN_COOKIE, token, {
          httpOnly: true,
          path: "/"
        })
        .json({
          ...user
        });
    } catch (err) {
      if (err) res.status(500).json({ message: "Something went wrong!" });
    }
  });

  app.post("/user/signout", async (req, res) => {
    const sessionCookie = req.cookies[SESSION_TOKEN_COOKIE];

    if (!sessionCookie)
      return res.status(401).json({ message: "No user logged in!" });

    try {
      const secretHash = hashed(sessionCookie);

      console.log("secretHash: ", secretHash);

      const currentSession = await prisma.session.findUnique({
        where: {
          secretHash
        }
      });

      if (!currentSession)
        return res.status(401).json({ message: "No session found!" });

      await prisma.session.deleteMany({
        where: {
          secretHash
        }
      });

      return res
        .status(200)
        .clearCookie(SESSION_TOKEN_COOKIE, {
          httpOnly: true,
          path: "/"
        })
        .end();
    } catch (err) {
      if (err) res.status(500).json({ error: "Something went wrong!" });
    }
  });
};
