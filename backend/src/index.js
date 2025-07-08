import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./Routes/auth.js";
import messageRoutes from "./Routes/message.js";
import { connectDb } from "./Lib/db.js";

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(port, () => {
    console.log("Server is running on port: " + port);
    connectDb();
})