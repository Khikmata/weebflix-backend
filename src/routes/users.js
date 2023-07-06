import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { checkAuth } from "../middleware/auth.js";
import { UserDetailsModel, UserModel } from "../models/User.js";

//init
const router = express.Router();

//routes
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

    // Create empty details for the user
    const details = new UserDetailsModel({ user: user._id });
    await details.save();

    // Update the user with the details
    user.details = details._id;
    await user.save();

    res.status(201).json({ message: "User has been created!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "This user doesn not exist" });
    }

    const checkPasswordValid = await bcrypt.compare(password, user.password);

    if (!checkPasswordValid) {
      return res.status(400).json({ message: "The username or password is incorrect" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.json({ token, userId: user._id });
  } catch (error) {
    console.log(error);
  }
});
router.get("/me", checkAuth, async (req, res) => {
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
router.get("/user/:id", checkAuth, async (req, res) => {
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

export { router as UserRouter };
