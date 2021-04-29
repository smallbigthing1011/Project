const express = require("express");
const router = express.Router();
const constants = require("../constants/constants");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const { requireUser } = require("../middlewares/auth");

router.post("/", async (req, res) => {
  const person = req.body;
  if (person.username === "" || person.password === "") {
    res.status(403).json({ message: "Please fulfill the form" });
  }
  const checkExisted = await User.findOne({ username: person.username });
  if (checkExisted) {
    res.status(403).json({ message: "Username is already in used!" });
  } else {
    const hash = await bcrypt.hashSync(person.password, constants.SALT_ROUNDS);
    person.password = hash;
    const newUser = await User.create(person);
    res.json(newUser);
  }
});

router.post("/sign-in", async (req, res) => {
  const person = req.body;
  const user = await User.findOne({ username: person.username });
  if (!user) {
    res.status(404).json({ message: "Invalid username or password!" });
  } else {
    const checkPassword = bcrypt.compareSync(person.password, user.password);
    if (!checkPassword) {
      res.status(404).json({ message: "Invalid username or password!" });
    } else {
      const token = jwt.sign({ userId: user._id }, constants.JWT_SECRET);
      res.cookie("token", token);
      res.json({ token });
    }
  }
});

router.get("/me", requireUser, (req, res) => {
  const user = req.user;
  res.json(user);
});

module.exports = router;
