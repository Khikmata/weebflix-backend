import express from "express";
import { checkAuth } from "../middleware/auth.js";
import { UserModel } from "../models/User.js";

const router = express.Router();

// Add to friends
router.post("/friends", checkAuth, async (req, res) => {
  try {
    const { friendId } = req.body;
    const user = await UserModel.findById(req.user.id);
    const friend = await UserModel.findById(friendId);
    if (!user || !friend) {
      return res.status(404).json({ error: "User or friend not found" });
    }
    user.friends.push(friendId);
    friend.friends.push(req.user.id);
    await user.save();
    await friend.save();
    res.status(201);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete from friends
router.delete("/friends/:friendId", checkAuth, async (req, res) => {
  try {
    const { friendId } = req.params;
    const user = await UserModel.findById(req.user.id);
    const friend = await UserModel.findById(friendId);
    if (!user || !friend) {
      return res.status(404).json({ error: "User or friend not found" });
    }
    user.friends.pull(friendId);
    friend.friends.pull(req.user.id);
    await user.save();
    await friend.save();
    res.status(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as FriendRouter };
