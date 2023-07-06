import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    malId: {
      type: String,
      required: true,
      unique: true,
    },
    text: {
      type: String,
      required: true,
      unique: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("comments", CommentSchema);
