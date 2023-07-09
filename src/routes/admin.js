import express from "express";
import { checkAuth } from "../middleware/auth.js";
import { verifyAdminRole } from "../middleware/verify.js";
import { Comment } from "../models/Comment.js";
import { UserModel } from "../models/User.js";

const router = express.Router();

router.use(checkAuth);
// Get all users (accessible only to admin users)
router.get("/users", verifyAdminRole, async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/comments", verifyAdminRole, checkAuth, async (req, res) => {
  try {
    const comments = await Comment.find().populate("user", "username profileImage");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as AdminRouter };
