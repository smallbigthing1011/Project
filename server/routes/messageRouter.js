const express = require("express");
const Message = require("../models/Message");
const { verifyToken, requireUser } = require("../middlewares/auth");
const mongoose = require("mongoose");
const router = express.Router({ mergeParams: true });

router.use(verifyToken, requireUser);

//POST new message
router.post("/room/:roomId", async (req, res) => {
  const userId = req.user._id;
  const { roomId } = req.params;
  const message = req.body;
  if (message.type === "alert") {
    const existedMessage = await Message.findOne({
      roomId,
      type: message.type,
      content: message.content,
    });
    if (existedMessage) {
      res.status(400).json({ message: "Already alerted!" });
    }
  } else if (message.type === "text") {
    const newMessage = await Message.create({
      content: message.content,
      type: message.type,
      userId,
      roomId,
    });
    if (!newMessage) {
      res.status(400).json({ message: "Unable to create new Message" });
    }
    res.json(newMessage);
  } else if (message.type === "image" || message.type === "video") {
    const newMessage = await Message.create({
      content: message.content,
      type: message.type,
      url: message.url,
      userId,
      roomId,
    });
    if (!newMessage) {
      res.status(400).json({ message: "Unable to create new Message" });
    }
    res.json(newMessage);
  } else if (message.type === "file") {
    const newMessage = await Message.create({
      content: message.content,
      type: message.type,
      url: message.url,
      filename: message.filename,
      userId,
      roomId,
    });
    if (!newMessage) {
      res.status(400).json({ message: "Unable to create new Message" });
    }
    res.json(newMessage);
  }
});

//EDIT message
router.put("/:messageId", async (req, res) => {
  const userId = req.user._id;
  const { messageId } = req.params;
  const message = req.body;
  if (!mongoose.isValidObjectId(messageId)) {
    res.status(400).json({ message: `Invalid message ID ${messageId}` });
  }
  const updatedMessage = await Message.findOneAndUpdate(
    {
      _id: messageId,
      userId,
    },
    { content: message.content },
    { new: true }
  );
  res.json(updatedMessage);
});

//DELETE message
router.delete("/:messageId", async (req, res) => {
  const userId = req.user._id;
  const { messageId } = req.params;

  if (!mongoose.isValidObjectId(messageId)) {
    res.status(400).json({ message: `Invalid message ID ${messageId}` });
  }
  const deletedMessage = await Message.findOneAndDelete({
    _id: messageId,
    userId,
  });
  res.json(deletedMessage);
});
module.exports = router;
