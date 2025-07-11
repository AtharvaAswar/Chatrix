import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./Routes/auth.js";
import messageRoutes from "./Routes/message.js";
import { connectDb } from "./Lib/db.js";
import { app, server } from "./Lib/socket.js";

dotenv.config();
const port = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: "15mb" }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(__dirname, "../frontend/dist"));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

server.listen(port, () => {
    console.log("Server is running on port: " + port);
    connectDb();
});