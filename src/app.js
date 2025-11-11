import express from "express";
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import { authRouter } from "./router/auth.js";
import { userRouter } from "./router/user.js";
import { profileRouter } from "./router/profile.js";
import { requestsRouter } from "./router/request.js";
import cookieParser from "cookie-parser";
import { initializaSocket } from "./utils/socket.js";
import cors from "cors";
import "./utils/cronjob.js"


import { createServer } from 'node:http';




dotenv.config();

const app = express();


app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}))
app.use(cookieParser());
app.use(express.json());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

 
//socket.io

const server = createServer(app);

initializaSocket(server);






connectDB()
  .then(() => {
    console.log("DB Connected!");
    server.listen(3000, "0.0.0.0", () =>
      console.log("Server is running on port 3000")
    );
  })
  .catch((err) => {
    console.error("DB not connected", err);
  });
