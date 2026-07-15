const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export function authenticate(req, res) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return null;
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { userId: decoded.userId, role: decoded.role };
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
    return null;
  }
}

export function adminOnly(user, res) {
  if (!user || user.role !== "ADMIN") {
    res.status(403).json({ error: "Admin access required" });
    return false;
  }
  return true;
}
