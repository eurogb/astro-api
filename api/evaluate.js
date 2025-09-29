
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const answers = JSON.parse(req.body);

    // 🔮 Poetic scoring logic
    const score = answers.reduce((acc, val) => acc + val, 0);
    let verdict = "";

    if (score < 5) verdict = "🌑 A quiet cosmic whisper surrounds you.";
    else if (score < 10) verdict = "🌤 Your stars are shifting — stay open.";
    else verdict = "🌟 Destiny dances in your favor today.";

    res.status(200).json({ score, verdict });
  } catch (err) {
    res.status(400).json({ error: 'Invalid input' });
  }
}
