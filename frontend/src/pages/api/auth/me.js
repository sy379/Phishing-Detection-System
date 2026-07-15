const prisma = require("../../../lib/prisma");
const { authenticate } = require("../../../lib/auth");

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const user = authenticate(req, res);
  if (!user) return;
  try {
    const found = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!found) return res.status(404).json({ error: "User not found" });
    res.json(found);
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
