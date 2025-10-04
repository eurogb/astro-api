import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // 1. Locate your JSON file
  const tipsPath = path.join(
    process.cwd(),
    'data',
    'tip',
    'tip.hr.json'
  );

  // 2. Read & parse
  let tips;
  try {
    const raw = fs.readFileSync(tipsPath, 'utf8');
    tips = JSON.parse(raw);
  } catch (e) {
    return res.status(500).json({ error: 'Could not load tips' });
  }

  // 3. Pick one tip at random
  const randomIndex = Math.floor(Math.random() * tips.length);
  const tip = tips[randomIndex] || 'Nema savjeta za danas.';

  // 4. Return as an object
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({ tip });
}
