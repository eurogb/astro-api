import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { date } = req.query;
  const filePath = path.join(process.cwd(), 'data', 'dan', `${date}-horoskop.json`);

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    res.status(200).json(jsonData);
  } catch (error) {
    res.status(404).json({ error: 'Horoskop not found for date: ' + date });
  }
}
