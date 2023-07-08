import express from "express";
import { checkAuth } from "../middleware/auth.js";
import { UserModel } from "../models/User.js";

const router = express.Router();

// Add anime to favorites
router.post("/", checkAuth, async (req, res) => {
  try {
    const { animeId } = req.body;
    const user = await UserModel.findById(req.user.id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.favoriteAnimeList.push(animeId);
    await user.save();
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete anime from favorites
router.delete("/:animeId", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.favoriteAnimeList.pull(req.params.animeId);
    await user.save();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as FavoriteRouter };
