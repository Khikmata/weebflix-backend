import express from "express";
import { checkAuth } from "../middleware/auth.js";
import { Comment } from "../models/Comment.js";
import { UserModel } from "../models/User.js";

const router = express.Router();

// Add comment
router.post("/", checkAuth, async (req, res) => {
  try {
    const { animeId, content } = req.body;

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user);
    console.log(req.userId);
    const comment = new Comment({
      user: req.userId,
      animeId,
      content,
    });

    user.comments.push(comment);
    await user.save();

    const populatedComment = await comment.populate("user", "username profileImage");

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit comment
router.put("/:commentId", checkAuth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const comment = user.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the user is the creator of the comment
    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
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

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const comment = user.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the user is the creator of the comment
    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    comment.remove();
    await user.save();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single comment by ID
router.get("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId).populate("user", "username profileImage");
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as CommentRouter };
