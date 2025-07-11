import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./Routes/auth.js";
import messageRoutes from "./Routes/message.js";
import { fileURLToPath } from "url";
import { connectDb } from "./Lib/db.js";
import { app, server } from "./Lib/socket.js";

dotenv.config();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "15mb" }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    const frontendPath = path.resolve(__dirname, "../../frontend/dist");
    app.use(express.static(frontendPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendPath, "../frontend/dist/index.html"));
    });
}

server.listen(port, () => {
    console.log("Server is running on port: " + port);
    connectDb();
});