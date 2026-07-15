const prisma = require("../../../lib/prisma");
const { authenticate, adminOnly } = require("../../../lib/auth");

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const user = authenticate(req, res);
  if (!user || !adminOnly(user, res)) return;
  try {
    const [totalUsers, totalScans, riskDistribution] = await Promise.all([
      prisma.user.count(),
      prisma.scan.count(),
      prisma.scan.groupBy({ by: ["riskLevel"], _count: { riskLevel: true } }),
    ]);
    const distribution = {};
    riskDistribution.forEach((r) => { distribution[r.riskLevel] = r._count.riskLevel; });
    res.json({ totalUsers, totalScans, riskDistribution: distribution });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}
