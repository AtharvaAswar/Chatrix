import expres from "express";
import http from "http";
import { Server } from "socket.io";

const app = expres();
const server = http.createServer(app);
// mark online users
const userSocketMap = {};

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true
    }
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    // bordcast events to all users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
});


export { app, server, io };