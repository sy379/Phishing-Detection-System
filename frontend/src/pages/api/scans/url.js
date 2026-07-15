const prisma = require("../../../lib/prisma");
const { authenticate } = require("../../../lib/auth");
const { analyzeUrl } = require("../../../lib/phishingDetector");

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const user = authenticate(req, res);
  if (!user) return;
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });
    const result = await analyzeUrl(url);
    const scan = await prisma.scan.create({
      data: { userId: user.userId, type: "URL", input: url, riskLevel: result.riskLevel, score: result.score, details: result.details },
    });
    res.json({ id: scan.id, riskLevel: result.riskLevel, score: result.score, details: result.details, scannedAt: scan.scannedAt });
  } catch (err) {
    console.error("URL scan error:", err);
    res.status(500).json({ error: "Scan failed" });
  }
}
