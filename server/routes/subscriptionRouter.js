const express = require("express");
const Subscription = require("../models/Subscription");
const mongoose = require("mongoose");
const { verifyToken, requireUser } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });
router.use(verifyToken, requireUser);

//POST new subscription (join room)
router.post("/:roomId", async (req, res) => {
  const userId = req.user._id;
  const { roomId } = req.params;
  if (mongoose.isValidObjectId(roomId)) {
    const existedSubscription = await Subscription.findOne({
      user: userId,
      room: roomId,
    });
    if (existedSubscription) {
      res.status(404).json({ message: "Already joined room!" });
    }
    const subscription = await Subscription.create({
      user: userId,
      room: roomId,
    });
    const roomSubscribed = subscription.populate("room");
    res.json(roomSubscribed);
  } else {
    res.status(404).json({ message: "Invalid Room ID" });
  }
});

//DELETE subscription (leave room)
router.delete("/:roomId", async (req, res) => {
  const userId = req.user._id;
  const { roomId } = req.params;
  const deletedSubscription = await Subscription.findOneAndRemove({
    user: userId,
    room: roomId,
  });
  if (!deletedSubscription) {
    res.status(404).json({ message: "Unable to leave room!" });
  }
  res.json(deletedSubscription);
});

module.exports = router;
