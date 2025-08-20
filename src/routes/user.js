const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const userRouter = express.Router();
const ConnectionRequest = require("../model/connection");
const User = require("../model/user");
userRouter.get("/user/requests/received", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName", "age" ,"gender","about","photoUrl"]);
    res.json({
      message: "Data fetched Successfully!!!",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(500).send("Internal Server Error " + err.message);
  }
});
userRouter.get("/user/connections", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName age photoUrl about gender")
      .populate("toUserId", "firstName lastName age photoUrl about gender");
    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Connections found Successfully!!!",
      data,
    });
  } catch (err) {
    res.status(500).send("Internal Server Error", +err.message);
  }
});
userRouter.get("/user/feed", authMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    // console.log(hideUsersFromFeed);`
    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser } },
      ],
    }).select("firstName lastName photoUrl age gender about");

    res.json({
      message: "fetched Successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).send("Internal Server Error" + err.message);
  }
});
module.exports = userRouter;
