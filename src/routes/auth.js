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
    console.log(error);
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
    res.json({ token, userId: user._id });
  } catch (error) {
    console.log(error);
  }
});

// Get current user
router.get("/me", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)
      .select("-password")
      .populate("favoriteList", "-_id title");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get current user's favorite anime list
router.get("/me/favoriteslist", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId)
      .select("favoriteList")
      .populate("favoriteList");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.favoriteAnimeList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user's watchlist
router.get("/me/watchlist", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("watchList").populate("watchList");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.watchlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user's watchlist
router.get("/me/starlist", checkAuth, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("starList").populate("starList");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.starList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as AuthRouter };
