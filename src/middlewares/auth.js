import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";
dotenv.config();

export const userAuth = async(req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid.");
    }
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user =await User.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }
      req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR: "+error.message);
  }
};
