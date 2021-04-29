const express = require("express");

const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const app = express();

const { verifyToken } = require("./middlewares/auth");

const userRouter = require("./routes/userRouter");
const roomRouter = require("./routes/roomRouter");
const subscriptionRouter = require("./routes/subscriptionRouter");
const messageRouter = require("./routes/messageRouter");
const videoRouter = require("./routes/videoRouter");

// view engine setup
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(verifyToken);
app.use("/user", userRouter);
app.use("/room", roomRouter);
app.use("/subscription", subscriptionRouter);
app.use("/message", messageRouter);
app.use("/video", videoRouter);

module.exports = app;
