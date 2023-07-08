import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import {
  AdminRouter,
  AuthRouter,
  CommentRouter,
  FavoriteRouter,
  FriendRouter,
  PlayerRouter,
  StarRouter,
  UserRouter,
  WatchlistRouter,
} from "./routes/index.js";

const app = express();

//CONFIG
app.use(express.json());
app.use(cors());
dotenv.config();

//ROUTING
app.use("/auth", AuthRouter);
app.use("/users", UserRouter);
app.use("/player", PlayerRouter);
app.use("/admin", AdminRouter);
app.use("/comments", CommentRouter);
app.use("/favorites", FavoriteRouter);
app.use("/friends", FriendRouter);
app.use("/star", StarRouter);
app.use("/watchlist", WatchlistRouter);

//CONSTANTS
const PORT = process.env.PORT || 4001;
const uri = `mongodb+srv://admin:${process.env.PASSWORD}@cluster1.qfkgm1c.mongodb.net/weebflix`;

//DB
mongoose.connect(uri);

//INIT
app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));
