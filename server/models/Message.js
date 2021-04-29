const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const messageSchema = new Schema(
  {
    content: String,
    type: String,
    filename: String,
    url: String,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    roomId: { type: Schema.Types.ObjectId, ref: "Room" },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
