import express from "express";
import { UserModel } from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { animeId, myRating } = req.body;
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.starList.push({ anime: animeId, myRating });
    await user.save();

    res.sendStatus(201);
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
