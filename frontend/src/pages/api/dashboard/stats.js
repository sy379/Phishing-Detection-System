const prisma = require("../../../lib/prisma");
const { authenticate } = require("../../../lib/auth");

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const user = authenticate(req, res);
  if (!user) return;
  try {
    const [totalScans, riskDistribution, recentScans, scanCounts] = await Promise.all([
      prisma.scan.count({ where: { userId: user.userId } }),
      prisma.scan.groupBy({ by: ["riskLevel"], where: { userId: user.userId }, _count: { riskLevel: true } }),
      prisma.scan.findMany({ where: { userId: user.userId }, orderBy: { scannedAt: "desc" }, take: 10 }),
      prisma.scan.groupBy({ by: ["type"], where: { userId: user.userId }, _count: { type: true } }),
    ]);
    const distribution = {};
    riskDistribution.forEach((r) => { distribution[r.riskLevel] = r._count.riskLevel; });
    const typeBreakdown = {};
    scanCounts.forEach((s) => { typeBreakdown[s.type] = s._count.type; });
    res.json({ totalScans, riskDistribution: distribution, recentScans, typeBreakdown });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Failed to load stats" });
  }
}
