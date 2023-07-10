import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  mal_id: { type: Number },
  timestamp: { type: Date, default: Date.now },
  content: { type: String },
});

export const Comment = mongoose.model("Comment", commentSchema);
