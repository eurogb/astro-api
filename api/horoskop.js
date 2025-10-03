import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { date } = req.query;
  const filePath = path.join(process.cwd(), 'docs', 'hr', 'prognoza', 'dan', `${date}-horoskop.json`);

  console.log("Requested date:", date);
  console.log("Resolved file path:", filePath);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log("File content preview:", fileContent.slice(0, 100));

    const jsonData = JSON.parse(fileContent);
    console.log("Parsed JSON keys:", Object.keys(jsonData));

    res.status(200).json(jsonData);
  } catch (error) {
    console.error("Horoskop error:", error);
    res.status(404).json({ error: 'Horoskop not found for date: ' + date });
  }
}
