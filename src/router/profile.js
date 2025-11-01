import express from "express";
import cookieParser from "cookie-parser";
import { userAuth } from "../middlewares/auth.js";
import { validateEditProfileData } from "../utils/validation.js";
import User from "../models/user.js";
export const profileRouter = express.Router();
profileRouter.use(cookieParser());

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    
    const user = req.user;
    res.json(user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req.body)) {
      throw new Error("Not a valid item to update.");
    }
    const loginUser = req.user;
    //  [key1, key2, key3..]
    Object.keys(req.body).forEach((key) => (loginUser[key] = req.body[key]));
    await loginUser.save();
    res.json({ message: `${loginUser.first_name}'s profile updated successfully.`,user:loginUser });
  } catch (error) {
    res.status(400).send("Something wrong with updating info." + error.message);
  }

});
