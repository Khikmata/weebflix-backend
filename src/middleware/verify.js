import { UserModel } from "../models/User.js";

//check if user is an administrator
export const verifyAdminRole = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  } catch (error) {
    json.status(404).json({ error: "User not found" });
  }
};

export const verifyUser = async (req, res, next) => {
  const user = await UserModel.findById(req.userId);
  if (!user) {
    return res.status(403).json({ error: "Not authorized" });
  }
  next();
};
