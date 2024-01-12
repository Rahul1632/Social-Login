import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/database.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";

const { PORT } = process.env;
const server = express();

server.use(cors());
server.use(express.json());
connectDB();

server.use("/api/v1/user", userRouter);

server.listen(PORT || 4000, () => {
  console.log(`Server is running on port ${PORT || 4000}`);
});
