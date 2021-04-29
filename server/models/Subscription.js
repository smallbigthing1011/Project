const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const subscriptionSchema = new Schema(
  {
    room: { type: Schema.Types.ObjectId, ref: "Room" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;
