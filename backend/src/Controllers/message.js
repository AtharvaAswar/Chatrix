import User from "../Models/user.js";
import Message from "../Models/message.js";
import cloudnary from "../Lib/cloudnary.js";
import { getReceiverSocketId, io } from "../Lib/socket.js";

export const usersForSideBar = async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (e) {
        console.log("Error in Fetching Users ", e.message);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getMessages = async (req, res) => {
    const myId = req.user._id;
    const { id: chatUserId } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { senderId: myId, reciverId: chatUserId },
                { senderId: chatUserId, reciverId: myId },
            ]
        }) // optional: sort by oldest -> newest

        res.status(200).json(messages);
    } catch (e) {
        console.log("Error in Finding Messages ", e.message);
        res.status(500).json({ message: "Server Error" });
    }
}

export const sendMessage = async (req, res) => {
    console.log("OK");
    const { text, image } = req.body;
    const myId = req.user._id;
    const { id: reciverId } = req.params;
    let imageUrl;
    try {
        if (image) {
            const uploadResponse = await cloudnary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: myId,
            reciverId: reciverId,
            text: text,
            image: imageUrl
        });

        await newMessage.save();

        // TODO: implement socket.io for realtime use
        const receiverSocketId = getReceiverSocketId(reciverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json(newMessage);
    } catch (e) {
        console.log("Error in Sending Message ", e.message);
        res.status(500).json({ message: "Server Error" });
    }
}