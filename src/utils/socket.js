
import { Server } from "socket.io";
import cors from "cors";
import crypto from 'crypto';

export const getSecretRoomId = (userId, targetUserId) => {
    return crypto
        .createHash("sha256")
        .update([userId, targetUserId].sort().join("_"))
        .digest("hex");
}

export const initializaSocket = (server) => {


    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    // use io.
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            if (!userId || !targetUserId) return;
            const roomId = getSecretRoomId({ userId, targetUserId });
            socket.join(roomId);
            console.log(`${firstName} joined the room ${roomId}`)
        });
        socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
            const roomId = getSecretRoomId({ userId, targetUserId });
            socket.to(roomId).emit("messageReceived", { firstName, text })
            console.log(firstName + " said " + text)

        });
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        })

    });

}