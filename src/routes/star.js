import express from "express";
import { UserModel } from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { animeData, myRating, userId } = req.body;

    console.log(animeData);
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingAnimeIndex = user.starList.findIndex(
      (entry) => entry.anime.mal_id === animeData.mal_id
    );

    if (existingAnimeIndex !== -1) {
      // Anime already exists in starList, update the rating
      user.starList[existingAnimeIndex].myRating = myRating;
      res.sendStatus(201).json({ message: "value changed" });
    } else {
      // Anime does not exist in starList, add it
      user.starList.push({ anime: animeData, myRating: myRating });
      res.sendStatus(201).json({ message: "value added" });
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

    await user.starList.remove(req.params.animeId);
    await user.save();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as StarRouter };
