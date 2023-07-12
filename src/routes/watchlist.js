import express from "express";

import { UserModel } from "../models/User.js";

const router = express.Router();

// Add anime to watchlist
router.post("/", async (req, res) => {
  try {
    const { animeData, watchState, userId } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Not authorized" });
    }

    const existingAnimeIndex = user.watchList.findIndex(
      (entry) => entry.anime.mal_id === animeData.mal_id
    );

    if (existingAnimeIndex !== -1) {
      // Anime already exists in watchlist, update the rating
      user.watchList[existingAnimeIndex].watchState = watchState;
      await user.save();
      return res.status(201).json({ message: "Watchstate changed successfully" });
    } else {
      // Anime does not exist in watchlist, add it
      user.watchList.push({ anime: animeData, watchState: watchState });
      await user.save();
      return res.status(201).json({ message: "Watchstate added successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
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

    return res.status(204);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export { router as WatchlistRouter };
