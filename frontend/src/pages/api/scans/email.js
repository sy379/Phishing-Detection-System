const prisma = require("../../../lib/prisma");
const { authenticate } = require("../../../lib/auth");
const { analyzeEmail } = require("../../../lib/phishingDetector");

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const user = authenticate(req, res);
  if (!user) return;
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Email content is required" });
    const result = await analyzeEmail(content);
    const scan = await prisma.scan.create({
      data: { userId: user.userId, type: "EMAIL", input: content.substring(0, 1000), riskLevel: result.riskLevel, score: result.score, details: result.details },
    });
    res.json({ id: scan.id, riskLevel: result.riskLevel, score: result.score, details: result.details, scannedAt: scan.scannedAt });
  } catch (err) {
    console.error("Email scan error:", err);
    res.status(500).json({ error: "Scan failed" });
  }
}
