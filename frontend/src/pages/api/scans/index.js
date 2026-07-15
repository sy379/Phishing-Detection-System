const prisma = require("../../../lib/prisma");
const { authenticate } = require("../../../lib/auth");

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const user = authenticate(req, res);
  if (!user) return;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const type = req.query.type;
    const riskLevel = req.query.riskLevel;
    const where = { userId: user.userId };
    if (type) where.type = type.toUpperCase();
    if (riskLevel) where.riskLevel = riskLevel.toUpperCase();
    const [scans, total] = await Promise.all([
      prisma.scan.findMany({ where, orderBy: { scannedAt: "desc" }, skip: (page - 1) * limit, take: limit }),
      prisma.scan.count({ where }),
    ]);
    res.json({ scans, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("List scans error:", err);
    res.status(500).json({ error: "Failed to fetch scans" });
  }
}
