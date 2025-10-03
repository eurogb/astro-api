import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { date } = req.query;

  const filePath = path.join(process.cwd(), 'docs', 'hr', 'prognoza', 'dan', `${date}-horoskop.json`);
  console.log("🔍 Requested date:", date);
  console.log("📁 Resolved file path:", filePath);

  try {
    if (!fs.existsSync(filePath)) {
      console.error("❌ File not found at path:", filePath);
      return res.status(404).json({ error: 'File not found for date: ' + date });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log("📄 File content preview:", fileContent.slice(0, 100));

    const jsonData = JSON.parse(fileContent);
    console.log("✅ Parsed JSON keys:", Object.keys(jsonData));

    if (jsonData.theme && jsonData.aries) {
      console.log("🎯 Flat format detected");
      return res.status(200).json(jsonData);
    }

    if (jsonData[date]) {
      console.log("🎯 Nested format detected");
      return res.status(200).json(jsonData[date]);
    }

    console.error("⚠️ Date key missing in parsed JSON");
    return res.status(404).json({ error: 'Horoskop not found for date: ' + date });
  } catch (error) {
    console.error("💥 Parsing error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
