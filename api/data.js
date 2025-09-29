import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-quiz-token");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const token = req.headers["x-quiz-token"];
  if (token !== "samja-astro-2025") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const file = req.query.file;
  if (!["questions", "results"].includes(file)) {
    return res.status(400).json({ error: "Invalid file requested" });
  }

  const filePath = path.join(process.cwd(), "data", `${file}.json`);
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(content);
    res.status(200).json(json);
  } catch (err) {
    res.status(500).json({ error: "Failed to load data" });
  }
}

