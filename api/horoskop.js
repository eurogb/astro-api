import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { date } = req.query;
  const safeDate = date?.replace(/[^0-9\-]/g, '');
  const filePath = path.join(process.cwd(), 'data', 'dan', `${safeDate}-horoskop.json`);

  try {
    const json = fs.readFileSync(filePath, 'utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(JSON.parse(json));
  } catch (err) {
    res.status(404).json({ error: 'Horoskop not found' });
  }
}

