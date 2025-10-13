import express from 'express';
import cookieParser from "cookie-parser";
import { userAuth } from "../middlewares/auth.js";
export const profileRouter = express.Router();
profileRouter.use(cookieParser());


profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR: "+ error.message);
  }
});