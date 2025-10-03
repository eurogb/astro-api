import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'docs', 'hr', 'prognoza', 'tip', 'tip.hr.json');
    console.log("Reading tip from:", filePath);

    if (!fs.existsSync(filePath)) {
      console.error("Tip file not found:", filePath);
      return res.status(404).json({ error: "Tip file not found" });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);

    res.status(200).json(jsonData);
  } catch (err) {
    console.error("tipHr error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
