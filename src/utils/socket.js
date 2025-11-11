
import { Server } from "socket.io";
import cors from "cors";

export const initializaSocket = (server) => {


    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",  // 프론트엔드 주소
            methods: ["GET", "POST"],
            credentials: true,                // 쿠키/세션 사용 시 필요
        }
    });

    // use io.
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            if (!userId || !targetUserId) return;
            const roomId = [userId, targetUserId].sort().join('_');
            socket.join(roomId);
            console.log(`${firstName} joined the room ${roomId}`)
        });
        socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
            const roomId = [userId, targetUserId].sort().join('_');
            socket.to(roomId).emit("messageReceived", { firstName, text })
            console.log(firstName + " said " + text)

        });
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        })

    });

}