import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./Routes/auth.js";
import messageRoutes from "./Routes/message.js";
import { connectDb } from "./Lib/db.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json({ limit: "15mb" }));
app.use(cookieParser());
app.use(cors({
    origin: " http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(port, () => {
    console.log("Server is running on port: " + port);
    connectDb();
});