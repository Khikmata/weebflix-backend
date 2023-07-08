export function verifyAdminRole(req, res, next) {
  console.log(req);
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}
