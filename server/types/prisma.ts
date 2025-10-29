import type { DefaultArgs } from "@prisma/client/runtime/binary";
import { Prisma, type PrismaClient } from "../generated/prisma/index.js";

export type PrismaClientType = PrismaClient<
  Prisma.PrismaClientOptions,
  never,
  DefaultArgs
>;
