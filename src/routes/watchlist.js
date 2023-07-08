import express from "express";
import { checkAuth } from "../middleware/auth.js";
import { UserModel } from "../models/User.js";

const router = express.Router();

// Add anime to watchlist
router.post("/watchlist", checkAuth, async (req, res) => {
  try {
    const { animeId } = req.body;
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.watchlist.push(animeId);
    await user.save();
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete anime from watchlist
router.delete("/watchlist/:animeId", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.watchlist.pull(req.params.animeId);
    await user.save();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as WatchlistRouter };
