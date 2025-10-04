// astro-api/api/tip/hr.js
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // Path to JSON file inside /data/tip/
    const filePath = path.join(process.cwd(), "data", "tip", "tip.hr.json");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(fileContent);

    // If JSON has array of tips, pick one randomly
    let tip;
    if (Array.isArray(jsonData.tips)) {
      tip = jsonData.tips[Math.floor(Math.random() * jsonData.tips.length)];
    } else if (typeof jsonData.tip === "string") {
      tip = jsonData.tip;
    } else {
      tip = "Nema dostupnih savjeta danas.";
    }

    res.status(200).json({ tip });
  } catch (err) {
    console.error("tip/hr error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
