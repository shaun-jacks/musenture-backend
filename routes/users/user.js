const express = require("express");
const router = express.Router();
const User = require("../../models/users");
const _ = require("lodash");
const authenticate = require("../../middleware/auth");

// Get user
router.get("/", async (req, res) => {
  const { id } = req.query;
  console.log("GET REQUEST with id");
  try {
    let user = await User.findOne({ _id: id });
    console.log(user);
    if (_.isEmpty(user)) {
      return res.status(400).json({ error: "User not found." });
    }
    const sanitizedUser = {
      displayName: user.displayName,
      instrument: user.instrument
    };
    console.log("GET Success");
    return res.status(200).json({ user: sanitizedUser });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// Get users
router.get("/", async (req, res) => {
  try {
    let users = await User.find({});
    console.log(users);
    if (_.isEmpty(users)) {
      return res.status(400).json({ error: "Users not found." });
    }
    const sanitizedUsers = users.map(user => {
      return { displayName: user.displayName, instrument: user.instrument };
    });
    return res.status(200).json(sanitizedUsers);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
});

//**********************//
/* Protected Routes */
//**********************//

// Get Me
router.get("/me", authenticate, async (req, res) => {
  const { id } = req.user;
  console.log("GET REQUEST to /me");
  try {
    let user = await User.findOne({ _id: id });
    console.log(user);
    if (_.isEmpty(user)) {
      return res.status(400).json({ error: "User not found." });
    }
    const sanitizedUser = {
      id: user._id,
      displayName: user.displayName,
      instrument: user.instrument,
      bio: user.bio,
      skill: user.skill,
      avatar: user.avatar,
      followers: user.followers,
      following: user.following
    };
    console.log("GET Success");
    return res.status(200).json({ user: sanitizedUser });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// Update user
router.put("/", authenticate, async (req, res) => {
  const { id } = req.user;
  const { bio, instrument, skill } = req.body;
  try {
    let result = await User.updateOne({ _id: id, bio, instrument, skill });
    console.log(result);
    return res.status(200).json({ msg: "Successfully updated user." });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// Follow a user
router.post("/follow", authenticate, async (req, res) => {
  const { toId } = req.body;
  const { id: fromId } = req.user;
  try {
    // Add user to followers of followed user
    await User.findOneAndUpdate(
      { _id: toId },
      { $push: { followers: fromId } }
    ).exec();
    // Add followed user to user's followers
    await User.findOneAndUpdate(
      { _id: fromId },
      { $push: { following: toId } }
    ).exec();

    return res.status(200).json({ msg: "Follow Success." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
});

// Unfollow a user
router.post("/unfollow", authenticate, async (req, res) => {
  const { toId } = req.body;
  const { id: fromId } = req.user;

  try {
    // Take user out of unfollowed user's followers
    await User.findOneAndUpdate(
      { _id: toId },
      { $pull: { followers: fromId } }
    ).exec();

    // Take unfollowed user out of user's following
    await User.findOneAndUpdate(
      { _id: fromId },
      { $pull: { following: toId } }
    ).exec();

    return res.status(200).json({ msg: "Unfollow Success." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
});

module.exports = router;
