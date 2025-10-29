import { PrismaClient } from "../generated/prisma/index.js";

export const prisma = new PrismaClient();

export const initPrisma = async () => {
  console.log(" You successfully connected to Prisma PostgreSQL!");
  await prisma.$connect();
};

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Prisma PostgreSQL connection closed due to app termination!");

  process.exit(0);
});
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  console.log("Prisma PostgreSQL connection closed due to app termination!");

  process.exit(0);
});
