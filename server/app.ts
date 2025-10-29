import express from "express";
import { usersController } from "./controllers/usersController.js";
import { createServer } from "node:http";
import { socketController } from "./controllers/socketController.js";
import { sessionController } from "./controllers/sessionController.js";
import cookieParser from "cookie-parser";
import { initMongo } from "./db/mongo.js";
import { initPrisma } from "./db/prisma.js";

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
