import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { date } = req.query;

  // Build path to docs/hr/prognoza/dan/YYYY-MM-DD-horoskop.json
  const filePath = path.join(process.cwd(), 'docs', 'hr', 'prognoza', 'dan', `${date}-horoskop.json`);
  console.log("Looking for horoscope file:", filePath);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    res.status(200).json(jsonData);
  } catch (error) {
    console.error("Horoskop error:", error);
    res.status(404).json({ error: 'Horoskop not found for date: ' + date });
  }
}
