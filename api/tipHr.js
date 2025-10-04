import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "data", "tip", "tip.hr.json");

    if (!fs.existsSync(filePath)) {
      console.warn("❌ Tip file not found:", filePath);
      return res.status(404).json({ error: "Tip file not found" });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { tips } = JSON.parse(fileContent);

    if (!Array.isArray(tips) || tips.length === 0) {
      console.warn("⚠️ Invalid or empty tips array");
      return res.status(400).json({ error: "Invalid tip structure" });
    }

    const tip = tips[Math.floor(Math.random() * tips.length)];
    res.status(200).json({ tip });
  } catch (err) {
    console.error("💥 tipHr error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
