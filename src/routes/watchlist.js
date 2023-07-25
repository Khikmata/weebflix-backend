import express from "express";

import { UserModel } from "../models/User.js";

const router = express.Router();

// Add anime to watchlist
router.post("/", async (req, res) => {
  try {
    const { anime, watchState, userId } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Not authorized" });
    }

    const existingAnimeIndex = user.list.findIndex((entry) => entry.anime.mal_id === anime.mal_id);

    if (existingAnimeIndex !== -1) {
      // Anime already exists in watchlist, update the rating
      user.list[existingAnimeIndex].watchState = watchState;
      await user.save();
      return res.status(201).json({ message: "Watch state changed successfully" });
    } else {
      // Anime does not exist in watchlist, add it
      user.list.push({ anime: anime, watchState: watchState });
      await user.save();
      return res.status(201).json({ message: "Watch state added successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete anime from watchlist
router.delete("/:animeId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const animeIndex = user.list.findIndex(
      (entry) => entry.anime.mal_id.toString() === req.params.animeId && entry.watchState !== null
    );
    if (animeIndex === -1) {
      return res.status(404).json({ error: "Anime not found in watchlist" });
    }

    user.list.splice(animeIndex, 1);
    await user.save();

    return res.status(200).json({ message: "Anime removed from watchlist successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export { router as WatchlistRouter };
