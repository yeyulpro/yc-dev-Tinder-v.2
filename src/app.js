import express from "express";
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import { authRouter } from "./router/auth.js";
import { userRouter } from "./router/user.js";
import { profileRouter } from "./router/profile.js";
import { requestsRouter } from "./router/request.js";
import cookieParser from "cookie-parser";
import User from "./models/user.js";
import cors from "cors";
import { initializaSocket } from "./utils/socket.js";
import { createServer } from "http";
import "./utils/cronjob.js"


dotenv.config();

const app = express();
const httpServer = createServer(app);

initializaSocket(httpServer);
app.use(cookieParser());

app.use(express.json());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);





connectDB()
  .then(() => {
    console.log("DB Connected!");
    httpServer.listen(3000, "0.0.0.0", () =>
      console.log("Server is running on port 3000")
    );
  })
  .catch((err) => {
    console.error("DB not connected", err);
  });
