import express from "express";
import { checkAuth } from "../middleware/auth.js";
import { verifyAdminRole } from "../middleware/verify.js";
import { UserModel } from "../models/User.js";

const router = express.Router();

// Get all users (accessible only to admin users)
router.get("/users", checkAuth, verifyAdminRole, async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as AdminRouter };
