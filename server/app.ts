import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "./generated/prisma/index.js";
import { usersController } from "./controllers/usersController.js";
import { createServer } from "node:http";
import { socketController } from "./controllers/socketController.js";
import { sessionController } from "./controllers/sessionController.js";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || "3000";

const app = express();
const server = createServer(app);
app.use(express.json());
app.use(cookieParser());

const prisma = new PrismaClient();

usersController(app, prisma);
sessionController(app, prisma);
// socketController(server);

server.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
