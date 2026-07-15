const prisma = require("../../../lib/prisma");
const { authenticate, adminOnly } = require("../../../lib/auth");

export default async function handler(req, res) {
  const user = authenticate(req, res);
  if (!user || !adminOnly(user, res)) return;

  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      return res.json(users);
    } catch (err) { return res.status(500).json({ error: "Failed to fetch users" }); }
  }

  if (req.method === "DELETE") {
    try {
      const userId = parseInt(req.query.id);
      const found = await prisma.user.findUnique({ where: { id: userId } });
      if (!found) return res.status(404).json({ error: "User not found" });
      await prisma.user.update({ where: { id: userId }, data: { isActive: false } });
      return res.json({ message: "User deactivated" });
    } catch (err) { return res.status(500).json({ error: "Failed to deactivate user" }); }
  }

  res.status(405).json({ error: "Method not allowed" });
}
