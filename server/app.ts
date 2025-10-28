import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { usersController } from "./controllers/usersController.js";
import { createServer } from "node:http";
import { socketController } from "./controllers/socketController.js";
import { sessionController } from "./controllers/sessionController.js";
import cookieParser from "cookie-parser";
import { initMongo } from "./db/mongo.js";
import { initPrisma } from "./db/prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || "3000";

const app = express();
const server = createServer(app);
app.use(express.json());
app.use(cookieParser());

initPrisma();
initMongo();

usersController(app);
sessionController(app);
socketController(server);

server.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
