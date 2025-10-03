import fs from 'fs';
import path from 'path';

// Confirm where Node thinks your project root is
console.log('🛠️  CWD at startup:', process.cwd());

export default function handler(req, res) {
  const { date } = req.query;
  console.log('🔍 Requested date:', date);

  const filePath = path.join(
    process.cwd(),
    'docs',
    'hr',
    'prognoza',
    'dan',
    `${date}-horoskop.json`
  );
  console.log('📁 Looking in:', filePath);

  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found:', filePath);
    return res
      .status(404)
      .json({ error: 'File not found for date: ' + date });
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log('📄 Preview:', fileContent.slice(0, 100));

    const jsonData = JSON.parse(fileContent);
    console.log('✅ Keys:', Object.keys(jsonData));

    // flat structure?
    if (jsonData.theme && jsonData.aries) {
      console.log('🎯 Detected flat JSON');
      return res.status(200).json(jsonData);
    }

    // nested under date?
    if (jsonData[date]) {
      console.log('🎯 Detected nested JSON');
      return res.status(200).json(jsonData[date]);
    }

    console.error('⚠️  No usable data format');
    return res
      .status(404)
      .json({ error: 'Horoskop not found for date: ' + date });
  } catch (err) {
    console.error('💥 Parse error:', err);
    return res
      .status(500)
      .json({ error: 'Internal Server Error' });
  }
}
