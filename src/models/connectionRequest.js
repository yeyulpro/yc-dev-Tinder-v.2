import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",//refernece to user collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"], // only those values are accepted
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);
//to prevent a user from selecting themselves

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot make a connection request to yourself.");
  }
  next();
});
//compound index -for efficient api query; 1:ascending, -1:descending
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });
const ConnectionRequest = mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

export default ConnectionRequest;
