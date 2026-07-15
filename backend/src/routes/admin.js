const express = require("express");
const prisma = require("../config/db");
const { authenticate, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/users", authenticate, adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (err) {
    console.error("Admin list users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.delete("/users/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    res.json({ message: "User deactivated" });
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ error: "Failed to deactivate user" });
  }
});

router.get("/scans", authenticate, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const type = req.query.type;
    const riskLevel = req.query.riskLevel;
    const userId = req.query.userId ? parseInt(req.query.userId) : undefined;

    const where = {};
    if (type) where.type = type.toUpperCase();
    if (riskLevel) where.riskLevel = riskLevel.toUpperCase();
    if (userId) where.userId = userId;

    const [scans, total] = await Promise.all([
      prisma.scan.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { scannedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.scan.count({ where }),
    ]);

    res.json({ scans, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Admin list scans error:", err);
    res.status(500).json({ error: "Failed to fetch scans" });
  }
});

router.get("/stats", authenticate, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalScans, riskDistribution, scansByDay] = await Promise.all([
      prisma.user.count(),
      prisma.scan.count(),
      prisma.scan.groupBy({
        by: ["riskLevel"],
        _count: { riskLevel: true },
      }),
      prisma.$queryRaw`
        SELECT DATE(scanned_at) as date, COUNT(*)::int as count
        FROM "Scan"
        WHERE scanned_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(scanned_at)
        ORDER BY date ASC
      `,
    ]);

    const distribution = {};
    riskDistribution.forEach((r) => {
      distribution[r.riskLevel] = Number(r._count.riskLevel);
    });

    res.json({ totalUsers, totalScans, riskDistribution: distribution, scansByDay });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;
