import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    details: { type: mongoose.Schema.Types.ObjectId, ref: "userdetails" },
    watchStateList: { type: mongoose.Schema.Types.ObjectId, ref: "watchStates" },
    favouriteList: { type: mongoose.Schema.Types.ObjectId, ref: "favorites" },
    commentList: { type: mongoose.Schema.Types.ObjectId, ref: "comments" },
    avatarUrl: String,
  },
  {
    timestamps: true,
  }
);
const UserDetailsSchema = new mongoose.Schema(
  {
    watchStateList: [
      {
        malId: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        imageUrl: [
          {
            type: String,
            required: true,
          },
        ],
        personalRating: {
          type: Number,
          required: true,
        },
        publicRating: {
          type: Number,
          required: true,
        },
        userOwner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
          required: true,
        },
        status: {
          type: String,
          enum: ["watched", "dropped", "planned"],
          required: true,
        },
      },
    ],
    favourites: [
      {
        malId: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        imageUrl: [
          {
            type: String,
            required: true,
          },
        ],
        personalRating: {
          type: Number,
          required: true,
        },
        publicRating: {
          type: Number,
          required: true,
        },
        userOwner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const UserDetailsModel = mongoose.model("userdetails", UserDetailsSchema);
export const UserModel = mongoose.model("users", UserSchema);
