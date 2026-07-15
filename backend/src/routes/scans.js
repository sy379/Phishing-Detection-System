const express = require("express");
const prisma = require("../config/db");
const { authenticate } = require("../middleware/auth");
const { analyzeUrl, analyzeEmail } = require("../services/phishingDetector");

const router = express.Router();

router.post("/url", authenticate, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const result = await analyzeUrl(url);

    const scan = await prisma.scan.create({
      data: {
        userId: req.userId,
        type: "URL",
        input: url,
        riskLevel: result.riskLevel,
        score: result.score,
        details: result.details,
      },
    });

    res.json({
      id: scan.id,
      riskLevel: result.riskLevel,
      score: result.score,
      details: result.details,
      scannedAt: scan.scannedAt,
    });
  } catch (err) {
    console.error("URL scan error:", err);
    res.status(500).json({ error: "Scan failed" });
  }
});

router.post("/email", authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Email content is required" });

    const result = await analyzeEmail(content);

    const scan = await prisma.scan.create({
      data: {
        userId: req.userId,
        type: "EMAIL",
        input: content.substring(0, 1000),
        riskLevel: result.riskLevel,
        score: result.score,
        details: result.details,
      },
    });

    res.json({
      id: scan.id,
      riskLevel: result.riskLevel,
      score: result.score,
      details: result.details,
      scannedAt: scan.scannedAt,
    });
  } catch (err) {
    console.error("Email scan error:", err);
    res.status(500).json({ error: "Scan failed" });
  }
});

router.get("/", authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const type = req.query.type;
    const riskLevel = req.query.riskLevel;

    const where = { userId: req.userId };
    if (type) where.type = type.toUpperCase();
    if (riskLevel) where.riskLevel = riskLevel.toUpperCase();

    const [scans, total] = await Promise.all([
      prisma.scan.findMany({
        where,
        orderBy: { scannedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.scan.count({ where }),
    ]);

    res.json({ scans, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("List scans error:", err);
    res.status(500).json({ error: "Failed to fetch scans" });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const scan = await prisma.scan.findFirst({
      where: { id: parseInt(req.params.id), userId: req.userId },
    });
    if (!scan) return res.status(404).json({ error: "Scan not found" });
    res.json(scan);
  } catch (err) {
    console.error("Get scan error:", err);
    res.status(500).json({ error: "Failed to fetch scan" });
  }
});

module.exports = router;
