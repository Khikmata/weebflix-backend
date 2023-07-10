import express from "express";

import { UserModel } from "../models/User.js";

const router = express.Router();

// Add anime to watchlist
router.post("/", async (req, res) => {
  try {
    const { animeId, watchState } = req.body;
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.watchList.push({ anime: animeId, watchState });
    await user.save();
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete anime from watchlist
router.delete("/:animeId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.watchList.remove(req.params.animeId);
    await user.save();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as WatchlistRouter };
