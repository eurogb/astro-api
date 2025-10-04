export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const allowedOrigins = [
    "https://eurogb.github.io",
    "https://star-nu-blond.vercel.app"
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-quiz-token");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = req.headers["x-quiz-token"];
  if (token !== "samja-astro-2025") return res.status(403).json({ error: "Forbidden" });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "unknown";
  const userAgent = req.headers["user-agent"] || "";
  const referer = req.headers.referer || "";
  const originHeader = origin || referer;

  const isBot = !userAgent.includes("Mozilla") || originHeader === "";
  if (isBot) {
    console.warn("🤖 Suspicious request detected:", { ip, userAgent, originHeader });
  }

  console.log("🔍 Request received:");
  console.log("IP:", ip);
  console.log("Token:", token);
  console.log("User-Agent:", userAgent);
  console.log("Origin:", originHeader);
  console.log("Timestamp:", new Date().toISOString());

  try {
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const rawBody = Buffer.concat(buffers).toString();
    const answers = JSON.parse(rawBody);

    if (!Array.isArray(answers)) throw new Error("Expected an array");

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
