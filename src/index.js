import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { PlayerRouter } from "./routes/player.js";
import { UserRouter } from "./routes/users.js";

const app = express();

//CONFIG
app.use(express.json());
app.use(cors());
dotenv.config();

//ROUTING
app.use("/auth", UserRouter);
app.use("/player", PlayerRouter);

//CONSTANTS
const PORT = process.env.PORT || 4001;
const uri = `mongodb+srv://admin:${process.env.PASSWORD}@cluster1.qfkgm1c.mongodb.net/weebflix`;

//DB
mongoose.connect(uri);

//INIT
app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));
