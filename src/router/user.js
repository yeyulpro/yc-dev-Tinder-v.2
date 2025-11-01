import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { requestsRouter } from "./request.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";
import { connect } from "mongoose";

export const userRouter = express.Router();
const USER_POPULATED_DATA =
  "first_name last_name photoUrl age gender skills about";
// received all interested requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loginUser = req.user;

    const receivedInterests = await ConnectionRequest.find({
      toUserId: loginUser._id,
      status: "interested",
    }).populate("fromUserId", USER_POPULATED_DATA);

    if (!receivedInterests) {
      throw new Error("Nobody interested in me...");
    }

    res.json({ receivedRequests: receivedInterests });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loginUser = req.user;

    const connectionPersons = await ConnectionRequest.find({
      $or: [
        { toUserId: loginUser._id, status: "accepted" },
        { fromUserId: loginUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_POPULATED_DATA)
      .populate("toUserId", USER_POPULATED_DATA);
    const connectedUserIds = connectionPersons.map((conn) => {
      if (conn.toUserId.toString() === loginUser._id.toString()) {
        return conn.fromUserId;
      } else {
        return conn.toUserId;
      }
    });
    const users = await User.find({_id: {$in:connectedUserIds}})
    
    res.json(users);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

// Show all users who have no connections with the logged-in user
// These users do not have any connections in the form of interested, ignored, accepted, or rejected
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loginUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    limit = limit > 30 ? 30 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loginUser._id }, { toUserId: loginUser._id }],
    }).select("fromUserId toUserId");

    const hiddenUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hiddenUserFromFeed.add(req.fromUserId);
      hiddenUserFromFeed.add(req.toUserId);
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUserFromFeed) } },
        { _id: { $ne: loginUser._id } },
      ],
    })
      .select(USER_POPULATED_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ feedList: users });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});
