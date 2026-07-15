const prisma = require("../../../lib/prisma");
const { authenticate, adminOnly } = require("../../../lib/auth");

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const user = authenticate(req, res);
  if (!user || !adminOnly(user, res)) return;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const where = {};
    if (req.query.type) where.type = req.query.type.toUpperCase();
    if (req.query.riskLevel) where.riskLevel = req.query.riskLevel.toUpperCase();
    const [scans, total] = await Promise.all([
      prisma.scan.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { scannedAt: "desc" }, skip: (page - 1) * limit, take: limit,
      }),
      prisma.scan.count({ where }),
    ]);
    res.json({ scans, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Admin scans error:", err);
    res.status(500).json({ error: "Failed to fetch scans" });
  }
}
