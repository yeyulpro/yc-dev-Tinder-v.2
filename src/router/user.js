import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { requestsRouter } from "./request.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";
import { connect } from "mongoose";

export const userRouter = express.Router();
const USER_POPULATED_DATA="first_name last_name photoUrl age gender skills about"
// received all interested requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loginUser = req.user;
       
        const interestedRequests = await ConnectionRequest.find({
            toUserId: loginUser._id,
            status: "interested",
        }).populate("fromUserId", USER_POPULATED_DATA);
        
        if (!interestedRequests) {
            throw new Error("Nobody interested in me...")
        }
        
       res.json({data: interestedRequests})
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

userRouter.get("/user/requests/accepted", userAuth, async (req, res) => {
    try{
    const loginUser = req.user;

      const acceptedRequest = await ConnectionRequest.find({
            toUserId: loginUser._id,
            status: "accepted",
        }).populate("fromUserId", "first_name last_name photoUrl age gender skills about");
        
        if (!acceptedRequest) {
            throw new Error("No one matched with me...")
        }
        
       res.json({data: acceptedRequest})
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loginUser = req.user;

      const connectionRequests = await ConnectionRequest.find({
          $or: [
              { toUserId: loginUser._id, status: "accepted" },
              {fromUserId:loginUser._id,status:"accepted"}
            ]
        }).populate("fromUserId", USER_POPULATED_DATA);
        const data = connectionRequests.map(line => line.fromUserId);
        res.json({data});
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})