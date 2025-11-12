import { Server } from "socket.io";
import cors from "cors";
import crypto from "crypto";
import { Chat } from "../models/chat.js";

export const getSecretRoomId = (userId, targetUserId) => {
    return crypto
        .createHash("sha256")
        .update([userId, targetUserId].sort().join("_"))
        .digest("hex");
};

export const initializaSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    // use io.
    io.on("connection", (socket) => {
        console.log("a user connected");

        socket.on("joinChat", async ({ firstName, userId, targetUserId }) => {
            if (!userId || !targetUserId) return;
            const roomId = getSecretRoomId(userId, targetUserId);
            socket.join(roomId);
            console.log(`${firstName} joined the room ${roomId}`);
        });
        socket.on(
            "sendMessage",
            async ({ firstName, userId, targetUserId, text }) => {
                //save msg to the db

                try {
                    const roomId = getSecretRoomId(userId, targetUserId);

                    let chat = await Chat.findOne({
                        participants: { $all: [userId, targetUserId] },
                    });

                    if (!chat) {
                        chat = new Chat({
                            participants: [userId, targetUserId],
                            messages: [],
                        });
                    }
                    chat.messages.push({
                        senderId: userId,
                        text,
                    });
                    await chat.save();
                    socket.to(roomId).emit("messageReceived", { firstName, text });
                } catch (err) {
                    console.log(err);
                }
            }
        );
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
