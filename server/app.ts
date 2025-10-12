import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "./generated/prisma/index.js";
import { usersController } from "./controllers/usersController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || "3000";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

usersController(app, prisma);

// app.get("/", async (_, res) => {
//   const users = await prisma.user.findMany();

//   console.log("users: ", users);

//   res.send(users[0]?.name);
// });

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
