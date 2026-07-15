const express = require("express");
const prisma = require("../config/db");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    const [totalScans, riskDistribution, recentScans, scanCounts] = await Promise.all([
      prisma.scan.count({ where: { userId } }),
      prisma.scan.groupBy({
        by: ["riskLevel"],
        where: { userId },
        _count: { riskLevel: true },
      }),
      prisma.scan.findMany({
        where: { userId },
        orderBy: { scannedAt: "desc" },
        take: 10,
      }),
      prisma.scan.groupBy({
        by: ["type"],
        where: { userId },
        _count: { type: true },
      }),
    ]);

    const distribution = {};
    riskDistribution.forEach((r) => {
      distribution[r.riskLevel] = r._count.riskLevel;
    });

    const typeBreakdown = {};
    scanCounts.forEach((s) => {
      typeBreakdown[s.type] = s._count.type;
    });

    res.json({
      totalScans,
      riskDistribution: distribution,
      recentScans,
      typeBreakdown,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

module.exports = router;
