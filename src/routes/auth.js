import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { checkAuth } from "../middleware/auth.js";
import { UserModel } from "../models/User.js";

//init
const router = express.Router();

//register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    //check if user is already registered
    const userExist = await UserModel.findOne({ username: username });
    if (userExist) {
      return res.status(400).json({ message: "This user already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with details
    const user = new UserModel({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User has been created!" });
  } catch (error) {
    res.status(500).json({
      message: "Нет доступа",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "This user doesn not exist" });
    }

    const checkPasswordValid = await bcrypt.compare(password, user.password);

    if (!checkPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(403).json({ message: error });
  }
});

// Get current user
router.get("/me", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)
      .select("-password")
      .populate("list", "-_id anime");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get current user's favorite anime list
router.get("/me/favoritelist", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("list").populate("list.anime");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const favorites = user.list.filter((entry) => entry.isFavorite);
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user's watchlist
router.get("/me/watchlist", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("list").populate("list.anime");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const watchlist = user.list.filter((entry) => entry.watchState !== null);
    res.status(200).json(watchlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user's watchlist
router.get("/me/starlist", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("list").populate("list.anime");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const starlist = user.list.filter((entry) => entry.myRating !== null);
    res.json(starlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as AuthRouter };
