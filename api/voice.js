import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import gTTS from "gtts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { text, gender } = req.body;
    if (!text) return res.status(400).json({ error: "Text required" });

    const voiceLang = gender === "male" ? "en" : "zh-CN";
    const filename = `voice_${Date.now()}.mp3`;
    const filepath = path.join(__dirname, "../public", filename);

    const tts = new gTTS(text, voiceLang);
    await new Promise((resolve, reject) => {
      tts.save(filepath, err => (err ? reject(err) : resolve()));
    });

    res.json({ url: `/${filename}` });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "TTS failed" });
  }
});
