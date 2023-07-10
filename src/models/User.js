import mongoose from "mongoose";
import { Anime, animeSchema } from "./Anime.js";
import { Comment } from "./Comment.js";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  profileImage: {
    type: String,
    default:
      "https://schooloflanguages.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg",
  },
  age: { type: Number },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [Comment.schema],
  favoriteList: [Anime.schema],
  watchList: [
    {
      anime: animeSchema,
      watchState: { type: String, enum: ["watched", "planned", "dropped"] },
    },
  ],
  starList: [
    {
      anime: animeSchema,
      myRating: { type: Number, min: 0, max: 10 },
    },
  ],
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model("User", userSchema);
