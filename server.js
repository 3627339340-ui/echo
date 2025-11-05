import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import generateHandler from "./api/generate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// API route
app.post("/api/generate", generateHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
