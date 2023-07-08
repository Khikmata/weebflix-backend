import mongoose from "mongoose";
import { animeSchema } from "./Anime.js";
import { Comment } from "./Comment.js";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  age: { type: Number },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [Comment.schema],
  favoriteList: [animeSchema],
  watchList: [animeSchema],
  starList: [animeSchema],
  role: { type: String, enum: ["user", "admin"], default: "user" },
  timestamps: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model("User", userSchema);
