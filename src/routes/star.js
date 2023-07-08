import express from "express";
import { checkAuth } from "../middleware/auth.js";
import { UserModel } from "../models/User.js";

const router = express.Router();

router.post("/", checkAuth, async (req, res) => {
  try {
    const { animeId } = req.body;
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.starredAnimeList.push(animeId);
    await user.save();

    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove anime from starred anime list
router.delete("/:animeId", checkAuth, async (req, res) => {
  try {
    const { animeId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.starredAnimeList.pull(animeId);
    await user.save();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as StarRouter };
