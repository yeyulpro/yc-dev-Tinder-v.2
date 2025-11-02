import express from "express";
import User from "../models/user.js";

import bcrypt from "bcrypt";
import { registerValidation } from "../utils/validation.js";

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    if (!req.body) {
      throw new Error("No user information found.");
    }
    //validation of data
    registerValidation(req.body);

    //encrypt password
    const hashedPasword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      ...req.body,
      password: hashedPasword,
    });

    await user.save();
    res.json({ message: "New user is successfully saved!!" ,data: user});
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
    console.log("Login request body:", req.body);
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials.");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) throw new Error("Invalid credentials.");
    const token = user.getJWT();
    if (!token) {
      throw new Error("token is not created");
    }
    res.cookie("token", token, {httpOnly: true, secure:false, sameSite:"lax",path:"/",  expires: new Date(Date.now() + 5 * 3600000) });

    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR :" + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .status(200)
    .send("logout success");
});

export { authRouter };
