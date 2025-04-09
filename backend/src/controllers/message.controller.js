import { User } from "../models/user.models.js"
import { Message } from "../models/message.models.js"
import cloudinary from '../lib/cloudinary.js'
import { getReceiverSocketId, io } from "../lib/socket.js"

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select('-password')

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getUsersForSidebar controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const senderId = req.user._id

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl = null;

        if (req.file) {
            const base64Image = `data:image/jpeg;base64,${req.file.buffer.toString("base64")}`;
            const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                folder: "chatImages",
            });
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};