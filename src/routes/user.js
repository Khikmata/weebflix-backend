import express from "express";
import { checkAuth } from "../middleware/auth.js";
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
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
});

router.get("/:id/favorites", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
      .select("favoriteAnimeList")
      .populate("favoriteAnimeList");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.favoriteAnimeList);
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
    res.json(user.watchlist);
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
    res.json(user.starlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as UserRouter };
