const express = require("express");
const router = express.Router();
const User = require("../../models/users");
const _ = require("lodash");
const authenticate = require("../../middleware/auth");

// Get user
router.get("/:id", async (req, res) => {
  const { id } = req.params;
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
    return res.status(200).json(sanitizedUser);
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

/* Protected Routes */

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
router.post("/follow/", authenticate, async (req, res) => {
  const { toId } = req.body;
  const { id: fromId } = req.user;
  try {
    // Add user to followers of followed user
    let userToFollow = await User.findOne({ _id: toId }).exec();
    userToFollow.followers.push(fromId);
    await userToFollow.save();
    // Add followed user to user's followers
    let userWhoFollowed = await User.findOne({ _id: fromId }).exec();
    userWhoFollowed.following.push(toId);
    await userWhoFollowed.save();

    return res.status(200).json({ msg: "Follow Success." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
});

// Unfollow a user
router.post("/unfollow/", authenticate, async (req, res) => {
  const { toId } = req.body;
  const { id: fromId } = req.user;

  try {
    // Take user out of unfollowed user's followers
    let userToUnfollow = await User.findOne({ _id: toId }).exec();
    userToUnfollow.followers = userToUnfollow.followers.filter(
      follower => follower !== fromId
    );
    await userToUnfollow.save();

    // Take unfollowed user out of user's following
    let userWhoUnfollowed = await User.findOne({ _id: fromId }).exec();
    userWhoUnfollowed.following = userWhoUnfollowed.following.filter(
      follower => {
        return follower !== toId;
      }
    );
    await userWhoUnfollowed.save();

    return res.status(200).json({ msg: "Unfollow Success." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
});

module.exports = router;
