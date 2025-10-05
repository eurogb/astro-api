import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // or your frontend domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end(); // Preflight response
    return;
  }

  const tipsPath = path.join(process.cwd(), 'data', 'tip', 'tip.hr.json');

  let tips;
  try {
    const raw = fs.readFileSync(tipsPath, 'utf8');
    tips = JSON.parse(raw);
  } catch (e) {
    return res.status(500).json({ error: 'Could not load tips' });
  }

  const randomIndex = Math.floor(Math.random() * tips.length);
  const tip = tips[randomIndex] || 'Nema savjeta za danas.';

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({ tip });
}
