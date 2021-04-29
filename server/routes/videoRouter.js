const express = require("express");
const constants = require("../constants/constants");
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

// const cors = require("cors");
const { verifyToken, requireUser } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });
router.use(verifyToken, requireUser);

// router.get("/token", (req, res) => {
//   const { roomId } = req.body;
//   const identity = req.user._id;
//   const videoGrant = new VideoGrant({ room: roomId });
//   const videoToken = new AccessToken(
//     constants.ACCOUNT_SID,
//     constants.API_KEY,
//     constants.API_SECRET,
//     { identity: identity }
//   );
//   videoToken.addGrant(videoGrant);
//   res.json({
//     token: videoToken.toJwt(),
//   });
// });
router.post("/token", (req, res) => {
  const { roomId } = req.body;
  const identity = req.user.username;
  const accessToken = new AccessToken(
    constants.ACCOUNT_SID,
    constants.API_KEY,
    constants.API_SECRET
  );

  accessToken.identity = identity;

  var grant = new VideoGrant();
  grant.room = roomId;
  accessToken.addGrant(grant);

  res.json({
    token: accessToken.toJwt(),
    identity,
  });
});

module.exports = router;
