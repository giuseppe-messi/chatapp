import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { initMongo } from "./db/mongo.js";
import { initPrisma } from "./db/prisma.js";
import { sessionController } from "./controllers/sessionController.js";
import { socketController } from "./controllers/socketController.js";
import { usersController } from "./controllers/usersController.js";
import { createServer } from "node:http";

const port = process.env.PORT || "3000";

export const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-appi.netlify.app" // the client in pro
];

const app = express();
const server = createServer(app);
app.use(express.json());
app.use(cookieParser());

// behind proxies like Render, needed for secure cookies
app.set("trust proxy", 1);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

await initPrisma();
await initMongo();

usersController(app);
sessionController(app);
socketController(server);

server.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
