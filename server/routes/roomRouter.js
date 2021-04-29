const express = require("express");
const mongoose = require("mongoose");

const Message = require("../models/Message");
const Room = require("../models/Room");
const Subscription = require("../models/Subscription");

const { verifyToken, requireUser } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireUser);

//GET rooms list that user has subscribed to
router.get("/list", async (req, res) => {
  const userId = req.user._id;
  const subscriptions = await Subscription.find({ user: userId }).populate(
    "room"
  );
  if (subscriptions.length == 0) {
    res.json({ message: "There is no rooms yet" });
  } else res.json(subscriptions);
});

//POST new room
router.post("/", async (req, res) => {
  const userId = req.user._id;
  const { name } = req.body;
  const exist = await Room.findOne({ host: userId, name });
  if (exist) {
    res.status(403).json({ message: "Room is existed!" });
  } else {
    const newRoom = await Room.create({
      name,
      host: userId,
    });
    const newSubscription = await Subscription.create({
      user: userId,
      room: newRoom._id,
    }); // Subscribe first user as host to a room
    res.json({ room: newRoom, subscription: newSubscription });
  }
});

//GET invitation through room's code
//Check host invitation ....
router.post("/invite", async (req, res) => {
  const { roomId } = req.body;
  const room = await Room.findById(roomId);
  if (!room) {
    res.status(404).json({ message: "Invitation is expired!" });
  } else {
    const totalMember = await Subscription.countDocuments({ room: roomId });
    res.json({ room, totalMember });
  }
});

//GET information of a room through room's id
router.get("/:roomId", async (req, res) => {
  const userId = req.user._id;
  const { roomId } = req.params;
  // const { page } = req.query;
  if (!mongoose.isValidObjectId(roomId)) {
    res.status(404).json({ message: `Cannot identify room ${roomId}` });
  }
  //Check if user has been in room
  const subscription = await Subscription.findOne({
    user: userId,
    room: roomId,
  });
  if (!subscription) {
    res.status(404).json({
      message: "No existed subscription!",
    });
  } else {
    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404).json({ message: `Room ${roomId} is not existed!` });
    } else {
      //GET all members in the room
      const members = await Subscription.find({ room: roomId }).populate(
        "user"
      );
      // const options = {
      //   page,
      //   limit: 10,
      //   sort: { createdAt: -1 },
      // };
      const messages = await Message.find({ roomId })
        .populate("userId")
        .sort({ _id: 1 });

      // .skip(options.limit * options.page - options.page)
      // .limit(options.limit)
      //GET all messages in the room
      res.json({
        room,
        messages,
        members,
        subscription,
      });
    }
  }
});

module.exports = router;
