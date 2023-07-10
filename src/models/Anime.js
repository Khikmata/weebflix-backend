import mongoose from "mongoose";

//type IDATA for frontend
export const animeSchema = new mongoose.Schema(
  {
    mal_id: { type: Number, required: true },
    image_url: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String },
    status: { type: String },
    score: { type: Number },
    synopsis: { type: String },
    background: { type: String },
    season: { type: String },
    year: { type: Number },
    producers: [
      {
        mal_id: { type: Number },
        type: { type: String },
        name: { type: String },
        url: { type: String },
      },
    ],
    genres: [
      {
        mal_id: { type: Number },
        type: { type: String },
        name: { type: String },
        url: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Anime = mongoose.model("Anime", animeSchema);
