export const config = {
  api: {
    bodyParser: false, // Disable default parser
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-quiz-token");

  // Handle preflight first — must return 200 OK before any checks
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Reject non-POST methods
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Secret token check (after OPTIONS)
  const token = req.headers["x-quiz-token"];
  if (token !== "samja-astro-2025") {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Rate limiting (10 requests per minute per IP)
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const now = Date.now();
  global.rateLimit = global.rateLimit || {};
  global.rateLimit[ip] = global.rateLimit[ip] || [];

  global.rateLimit[ip] = global.rateLimit[ip].filter(ts => now - ts < 60000); // last 60 sec

  if (global.rateLimit[ip].length >= 10) {
    return res.status(429).json({ error: "Previše zahtjeva — pokušaj kasnije." });
  }

  global.rateLimit[ip].push(now);

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
