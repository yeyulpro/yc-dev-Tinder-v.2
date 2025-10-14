import express from "express";
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";

export const requestsRouter = express.Router();

requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const fromUser = await User.findById(fromUserId);
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ error: "the user doesn't exist." });
      }

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ error: "Invalid status type : " + status });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      //check duplicate connection request
      const existing = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existing) {
        return res
          .status(400)
          .json({ error: "You already sent a request to this user." });
      }
      console.log("existing" + existing);
      const data = await connectionRequest.save();
      res.json({
        message: `${fromUser.first_name} is interested in ${toUser.first_name}`,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR :" + error.message);
    }
  }
);
