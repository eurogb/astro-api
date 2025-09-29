export const config = {
  api: {
    bodyParser: false, // Disable default parser
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Read raw body
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const rawBody = Buffer.concat(buffers).toString();

    // Parse JSON safely
    const answers = JSON.parse(rawBody);

    if (!Array.isArray(answers)) {
      throw new Error("Expected an array");
    }

    // Poetic scoring logic
    const score = answers.length;
    let verdict = "";

    if (score < 5) verdict = "🌑 Tiho šaptanje svemira prati tvoje korake.";
    else if (score < 10) verdict = "🌤 Zvijezde se pomiču — ostani otvoren/a.";
    else verdict = "🌟 Sudbina pleše u tvoju korist danas.";

    res.status(200).json({ score, verdict });
  } catch (err) {
    res.status(400).json({ error: "Invalid input" });
  }
}
