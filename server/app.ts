import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || "3000";

const app = express();

app.get("/", (_, res) => {
  res.send("Hello...!!!");
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
