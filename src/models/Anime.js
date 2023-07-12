import mongoose from "mongoose";

//type IDATA for frontend
export const animeSchema = new mongoose.Schema(
  {
    mal_id: { type: Number, required: true },
    images: {
      webp: {
        image_url: { type: String },
        large_image_url: { type: String },
        small_image_url: { type: String },
      },
    },
    title: { type: String },
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
