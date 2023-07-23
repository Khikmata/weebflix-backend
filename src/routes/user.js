import express from "express";
import { Comment } from "../models/Comment.js";
import { UserModel } from "../models/User.js";

const router = express.Router();

//get specific user
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

//get specific user's favorites
router.get("/:id/favorites", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select("list").populate("list.anime");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const favorites = user.list.filter((entry) => entry.isFavorite);

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//get specific user's watchlist
router.get("/:id/watchlist", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select("list").populate("list.anime");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const watchlist = user.list.filter((entry) => entry.watchState !== null);

    res.status(200).json(watchlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get specific user's starlist
router.get("/:id/starlist", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select("list").populate("list.anime");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const starlist = user.list.filter((entry) => entry.myRating !== null);

    res.status(200).json(starlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get information about favlist, starlist, watchlist, comments while logged in
router.get("/:userId/:animeId", async (req, res) => {
  try {
    const { userId, animeId } = req.params;
    // Check if the anime exists
    const user = await UserModel.findById(userId)
      .populate({ path: "list.anime" })
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

    // Check if the anime is in the user's favoriteList
    const favoriteEntry = user.list.find(
      (entry) => entry.anime && entry.anime.mal_id.toString() === animeId && entry.isFavorite
    );
    const isFavorite = favoriteEntry ? true : false;

    // Check if the anime is in the user's watchList
    const watchlistEntry = user.list.find((entry) => {
      return entry.anime && entry.anime.mal_id.toString() === animeId && entry.watchState !== null;
    });
    console.log(watchlistEntry);
    const watchState = watchlistEntry ? watchlistEntry.watchState : null;

    // Check if the anime is in the user's starList
    const starlistEntry = user.list.find(
      (entry) => entry.anime && entry.anime.mal_id.toString() === animeId && entry.myRating !== null
    );
    const myRating = starlistEntry ? starlistEntry.myRating : null;

    // Check if the anime has comments from the user
    const comments = await Comment.find({ mal_id: animeId }).populate(
      "user",
      "username profileImage"
    );

    const animeDetails = {
      animeId,
      isFavorite,
      watchState,
      myRating,
      comments,
    };

    res.json(animeDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as UserRouter };
