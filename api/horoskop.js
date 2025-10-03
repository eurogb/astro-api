import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { date } = req.query;

  const filePath = path.join(process.cwd(), 'docs', 'hr', 'prognoza', 'dan', `${date}-horoskop.json`);
  console.log("Looking for file:", filePath);

  try {
    if (!fs.existsSync(filePath)) {
      console.error("File not found:", filePath);
      return res.status(404).json({ error: 'File not found for date: ' + date });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);

    // If it's flat, return directly
    if (jsonData.theme && jsonData.aries) {
      return res.status(200).json(jsonData);
    }

    // If it's nested under date key
    if (jsonData[date]) {
      return res.status(200).json(jsonData[date]);
    }

    console.error("Date key missing in file:", date);
    return res.status(404).json({ error: 'Horoskop not found for date: ' + date });
  } catch (error) {
    console.error("Parsing error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
