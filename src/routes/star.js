import express from "express";
import { UserModel } from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { anime, myRating, userId } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Not authorized" });
    }

    const existingAnimeIndex = user.list.findIndex((entry) => entry.anime.mal_id === anime.mal_id);

    if (existingAnimeIndex !== -1) {
      // Anime already exists in the list, update the rating
      user.list[existingAnimeIndex].myRating = myRating;
      res.status(201).json({ message: "Rating changed successfully" });
    } else {
      // Anime does not exist in the list, add it
      user.list.push({ anime: anime, myRating: myRating });
      res.status(201).json({ message: "Rating added successfully" });
    }

    await user.save();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove anime from starred anime list
router.delete("/:animeId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const animeIndex = user.list.findIndex((entry) => entry.anime.mal_id === req.params.animeId);
    if (animeIndex === -1) {
      return res.status(404).json({ error: "Anime not found in starred anime list" });
    }

    user.list.splice(animeIndex, 1);
    await user.save();

    res.status(204).json({ message: "Rating removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as StarRouter };
