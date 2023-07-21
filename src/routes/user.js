import express from "express";
import { checkAuth } from "../middleware/auth.js";
import { Comment } from "../models/Comment.js";
import { UserModel } from "../models/User.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).populate("details");

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { password, details, ...userData } = user._doc;
    const { favourites, watchStateList } = details;

    res.json({
      ...userData,
      details: { favourites, watchStateList },
    });
  } catch (err) {
    res.status(500).json({
      message: "Нет доступа",
    });
  }
});

router.get("/:id/favorites", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
      .select("favoriteList")
      .populate("favoriteList");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: user.favoriteList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id/watchlist", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select("watchlist").populate("watchlist");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.watchList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id/starlist", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select("starlist").populate("starlist");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.starList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:userId/:animeId", async (req, res) => {
  try {
    const { animeId, userId } = req.params;

    // Check if the anime exists
    const user = await UserModel.findById(userId)
      .populate({
        path: "favoriteList",
        match: { mal_id: animeId },
      })
      .populate({
        path: "watchList",
        match: { "anime.mal_id": animeId },
      })
      .populate({
        path: "starList",
        match: { "anime.mal_id": animeId },
      })
      .populate({
        path: "comments",
        match: { mal_id: animeId },
        populate: {
          path: "user",
          select: "username profileImage",
        },
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user.favoriteList);

    // Check if the anime is in the user's favoriteList
    const isFavorite = user.favoriteList.length > 0;
    // Check if the anime is in the user's starList
    const starAnime = user.starList.find((anime) => anime.animeId === animeId);
    if (starAnime) {
      const myRating = starAnime.myRating; // Assuming myRating is a number field in starList.anime
      return { myRating };
    }
    // Check if the anime is in the user's watchList
    const isWatchlisted = user.watchList.length > 0;

    // Check if the anime has comments from the user
    const comments = await Comment.find({ mal_id: animeId }).populate(
      "user",
      "username profileImage"
    );

    const animeDetails = {
      animeId,
      isFavorite,
      isWatchlisted,
      isStarred,
      comments,
    };

    res.json({ message: animeDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as UserRouter };
