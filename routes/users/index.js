const express = require("express");
const router = express.Router();
const facebookAuth = require("./auth/facebook");
const User = require("../../models/users");
const _ = require("lodash");

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { bio, instrument, skill } = req.body;
  let user = await User.findOne({ _id: id }).exec();
  console.log(user);
  if (_.isEmpty(user)) {
    return res.status(400).json({ error: "User not found" });
  }
  user.bio = bio;
  user.instrument = instrument;
  user.skill = skill;
  await user.save();
  return res
    .status(200)
    .json({ bio: user.bio, instrument: user.instrument, skill: user.skill });
});

router.use("/auth/facebook", facebookAuth);

module.exports = router;
