const { authMiddleware } = require("../middleware/authMiddleware");
const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../model/connection");
const User = require("../model/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  authMiddleware,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "accepted", "interested", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(404).send(status + "it is not vaild");
      }
      if (fromUserId.equals(toUserId)) {
        return res
          .status(400)
          .send("You cannot send a connection request to yourself");
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).send("User doesn't exist");
      }

      // If there is an existing Connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(404).send(" Connection Request Already Exist");
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: "Connection request send Successfully!!!",
        data,
      });
    } catch (err) {
      res.status(500).send("Internal Server Error " + err.message);
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  authMiddleware,
  async (req, res) => {
    try {
      const loggedInUser=req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(404).send(status + "status is not valid");
      }
      const connectionRequest=await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser._id,
        status:'interested'
      })
      if(!connectionRequest){
        return res.status(404).send('Connection request not found');
      }
      connectionRequest.status=status;
      const data=await connectionRequest.save();
      res.json({
        message:'Connection request'+status,
        data
      })
    } catch (err) {
      res.status(500).send("Internal Server Error " + err.message);
    }
  }
);


module.exports = requestRouter;
