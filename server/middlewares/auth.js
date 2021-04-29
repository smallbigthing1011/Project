const jwt = require("jsonwebtoken");
const contants = require("../constants/constants");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  const token = req.headers.token;
  try {
    const tokenData = jwt.verify(token, contants.JWT_SECRET);
    const user = await User.findById(tokenData.userId);
    if (user) {
      req.user = user;
    }
  } catch (error) {
    req.user = null;
  }
  next();
};

const requireUser = (req, res, next) => {
  const user = req.user;
  if (user) return next();
  res.status(403).json({ message: "Unauthorized!" });
};

module.exports = { verifyToken, requireUser };
