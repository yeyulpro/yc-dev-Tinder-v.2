
import { Server  } from "socket.io";


export const initializaSocket = (httpServer) => {
    
const io = new Server(httpServer, { cors: { origin: "http://localhost:5173" } });
io.on("connection", (socket) => {
    Server.on("JoinChat", () => {
        
    });
    Server.on("sendMessage", () => {
        
    });
    Server.on("disconnect", () => {
        
    })
})

}