import { Chat } from "../models/chat.js";
import express from "express";
import { userAuth } from "../middlewares/auth.js";
export const chatRouter = express.Router();

chatRouter.get("/chat/:userId/:targetUserId", userAuth, async (req, res) => {
    const { userId, targetUserId } = req.params;
    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        }).populate("messages.senderId", "first_name photoUrl");
        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });
            await chat.save();
        }
        console.log("here is ", chat);
        res.json(chat);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
});
