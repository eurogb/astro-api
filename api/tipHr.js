// astro-api/api/tip/hr.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'docs/hr/prognoza/tip/tip.hr.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const { tips } = JSON.parse(raw);

  const tip = tips[Math.floor(Math.random() * tips.length)];
  res.status(200).json({ tip });
}

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);

    res.status(200).json(jsonData);
  } catch (err) {
    console.error("tipHr error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
