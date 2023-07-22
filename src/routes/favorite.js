import express from "express";

import { UserModel } from "../models/User.js";

const router = express.Router();

// Add anime to favorites
router.post("/", async (req, res) => {
  try {
    const { anime, userId } = req.body;
    console.log(userId, anime);
    const user = await UserModel.findById(userId).populate("list");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the anime with the same ID already exists in the favoriteList
    const isDuplicate = user.list.some((entry) => {
      return entry.anime.mal_id === anime.mal_id;
    });
    if (isDuplicate) {
      return res.status(409).json({ error: "Anime already exists in favorites" });
    }

    user.list.push({ anime, isFavorite: true });
    await user.save();

    res.status(201).json({ message: "Anime added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete anime from favorites
router.delete("/", async (req, res) => {
  try {
    const { animeId, userId } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const animeIndex = user.list.findIndex((entry) => entry.anime.mal_id === animeId);
    if (animeIndex === -1) {
      return res.status(404).json({ error: "Anime not found in favorites" });
    }

    user.list.splice(animeIndex, 1);
    await user.save();

    res.status(204).json({ message: "Anime removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as FavoriteRouter };
