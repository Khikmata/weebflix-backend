import mongoose from "mongoose";

export const animeSchema = new mongoose.Schema({
  mal_id: { type: Number },
  url: { type: String },
  images: {
    jpg: {
      image_url: { type: String },
      small_image_url: { type: String },
      large_image_url: { type: String },
    },
    webp: {
      image_url: { type: String },
      small_image_url: { type: String },
      large_image_url: { type: String },
    },
  },
  trailer: {
    youtube_id: { type: String },
    url: { type: String },
    embed_url: { type: String },
  },
  approved: { type: Boolean },
  titles: [
    {
      type: { type: String },
      title: { type: String },
    },
  ],
  title: { type: String },
  title_english: { type: String },
  title_japanese: { type: String },
  title_synonyms: [{ type: String }],
  type: { type: String },
  source: { type: String },
  episodes: { type: Number },
  status: { type: String },
  airing: { type: Boolean },
  aired: {
    from: { type: String },
    to: { type: String },
    prop: {
      from: {
        day: { type: Number },
        month: { type: Number },
        year: { type: Number },
      },
      to: {
        day: { type: Number },
        month: { type: Number },
        year: { type: Number },
      },
      string: { type: String },
    },
  },
  duration: { type: String },
  rating: { type: String },
  score: { type: Number },
  scored_by: { type: Number },
  rank: { type: Number },
  popularity: { type: Number },
  members: { type: Number },
  favorites: { type: Number },
  synopsis: { type: String },
  background: { type: String },
  season: { type: String },
  year: { type: Number },
  broadcast: {
    day: { type: String },
    time: { type: String },
    timezone: { type: String },
    string: { type: String },
  },
  producers: [
    {
      mal_id: { type: Number },
      type: { type: String },
      name: { type: String },
      url: { type: String },
    },
  ],
  licensors: [
    {
      mal_id: { type: Number },
      type: { type: String },
      name: { type: String },
      url: { type: String },
    },
  ],
  studios: [
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
  explicit_genres: [
    {
      mal_id: { type: Number },
      type: { type: String },
      name: { type: String },
      url: { type: String },
    },
  ],
  themes: [
    {
      mal_id: { type: Number },
      type: { type: String },
      name: { type: String },
      url: { type: String },
    },
  ],
  demographics: [
    {
      mal_id: { type: Number },
      type: { type: String },
      name: { type: String },
      url: { type: String },
    },
  ],
});
