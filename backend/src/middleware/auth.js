const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function adminOnly(req, res, next) {
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

module.exports = { authenticate, adminOnly };
