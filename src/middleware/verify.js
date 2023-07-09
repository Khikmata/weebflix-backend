import { UserModel } from "../models/User.js";

//check if user is an administrator
export async function verifyAdminRole(req, res, next) {
  const user = await UserModel.findById(req.userId);
  if (user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}
