import express from "express";
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";
import { run } from "../utils/sendEmail.js";


export const requestsRouter = express.Router();
//initial stage of choosing a person you are interested in .

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

      const data = await connectionRequest.save(); //.save return the object saved.

      //ses email
      const emailRes = await run(`${fromUser.first_name} is interested in ${toUser.first_name}`);
      console.log("hey!~EMAIL : " +JSON.stringify(emailRes));  //

      res.json({
        message: `${fromUser.first_name} is interested in ${toUser.first_name}`,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR :" + error.message);
    }
  }
);
// login User chooses to accept the partners among the ppl who are interested in the loginUser
requestsRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      // loginuser
      const loginUser = req.user;
      //allowed status- accepted or rejected
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          error: "Not a valid status. Only accepted or rejected is allowed.",
        });
      }

      //query a connection request obj that filtered by user:toUserId, status: interested
      const ReceivedConnectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loginUser._id,
        status: "interested",
      });
      if (!ReceivedConnectionRequest) {
        return res.status(400).json({ error: "The request is not found." });
      }
      const updatedStatus =
        ReceivedConnectionRequest.status === "interested"
          ? "accepted"
          : ReceivedConnectionRequest.status;
      ReceivedConnectionRequest.status = updatedStatus;
      await ReceivedConnectionRequest.save();

      res.json({
        message: `Your status has been updated : ${ReceivedConnectionRequest.status}`,
        ReceivedConnectionRequest,
      });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);
