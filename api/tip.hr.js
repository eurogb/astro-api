import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'tip', 'tip.hr.json');
  try {
    const json = fs.readFileSync(filePath, 'utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(JSON.parse(json));
  } catch (err) {
    res.status(500).json({ error: 'Tip data unavailable' });
  }
}

