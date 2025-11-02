import express from "express";
import connectDB from "./config/database.js";
import dotenv from "dotenv";
import { authRouter } from "./router/auth.js";
import { userRouter } from "./router/user.js";
import  {profileRouter}  from "./router/profile.js";
import { requestsRouter } from "./router/request.js";
import cookieParser from "cookie-parser";
import User from "./models/user.js";
import cors from 'cors'

dotenv.config();

const app = express();
app.use(cookieParser()); 
app.use(cors({
  origin: 'http://localhost:5173',
  credentials:true 
}));
app.use(express.json());




app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);


app.get("/users", async (req, res) => {
  
  
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(400).send("not found :" + err.message);
  }
});

app.get("/user", async (req, res) => {
  const email = req.body.emailId;
  const user = User.find(email);
  try {
    if (!user) {
      res.status(404).send("No user found " + err.message);
    }
    res.send(user);
  } catch (err) {
    res.status(404).send("Unable to get the user " + err.message);
  }
});

app.delete("/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findOneAndDelete({ _id: userId });
    console.log("deleted user obj" + deletedUser);
    res.send("successfully deleted");
  } catch (err) {
    res.status(400).send("no deletion");
    console.error(err.message);
  }
});

app.patch("/user/:id", async (req, res) => {
  const userId = req.params?.id;
  const data = req.body;
  try {
    const ALLOWED_UPDATED = ["photoUrl", "about", "gender", "skills"];
    const isUpdatedAllowed = Object.keys(data).every((x) =>
      ALLOWED_UPDATED.includes(x)
    );

    if (!isUpdatedAllowed) {
      throw new Error("Update is not allowed");
    }
    if (data.skills?.length > 3) {
      throw new Error("only three skills at most..");
    }

    await User.findByIdAndUpdate(userId, data);
    res.send("updated!!!");
  } catch (error) {
    res.status(400).send("updated not allowed " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("DB Connected!");
    app.listen(3000,"0.0.0.0" ,() => console.log("Server is running on port 3000"));
  })
  .catch((err) => {
    console.error("DB not connected", err);
  });
