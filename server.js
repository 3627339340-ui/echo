import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { router as voiceRouter } from "./api/voice.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/voice", voiceRouter);

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
