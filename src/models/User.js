import mongoose from "mongoose";
import { animeSchema } from "./Anime.js";

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
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  list: [
    {
      anime: animeSchema,
      watchState: {
        type: String,
        enum: ["completed", "planned", "dropped", "watching", "on hold"],
      },
      myRating: { type: Number, min: 0, max: 10 },
      isFavorite: { type: Boolean },
    },
  ],
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model("User", userSchema);
