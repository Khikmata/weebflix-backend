import express from "express";
import { checkAuth } from "../middleware/auth.js";
import { UserModel } from "../models/User.js";

const router = express.Router();

// Add comment
router.post("/", checkAuth, async (req, res) => {
  try {
    const { animeId, content } = req.body;
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const comment = new Comment({
      user: req.user.id,
      animeId,
      content,
    });

    user.comments.push(comment);
    await user.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit comment
router.put("/:commentId", checkAuth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const comment = user.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    comment.content = content;
    await user.save();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete comment
router.delete("/:commentId", checkAuth, async (req, res) => {
  try {
    const { commentId } = req.params;

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const comment = user.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    comment.remove();
    await user.save();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as CommentRouter };
