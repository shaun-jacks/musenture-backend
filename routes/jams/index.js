const express = require("express");
const router = express.Router();
const Jam = require("../../models/jams");
const _ = require("lodash");
const authenticate = require("../../middleware/auth");

// Get jams
router.get("/", async (req, res) => {
  let jams = await Jam.find({}).exec();
  if (_.isEmpty(jams)) {
    return res.status(400).json({ error: "Jams not found" });
  }
  return res.status(200).json(jams);
});

// Get jam by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Jam made to id: ", id);
  let jam = await Jam.findOne({ id }).exec();
  console.log("GET Success!");
  return res.status(200).json(jam);
});

// Get jams by user id
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("GET Jam by user id: ", userId);
  let jam = await Jam.find({ "user.userId": userId }).exec();
  console.log("GET Success!", jam);
  return res.status(200).json(jam);
});

/* Protected Routes */

// Create a jam
router.post("/", authenticate, async (req, res) => {
  const { id: userId, displayName } = req.user;
  const {
    location,
    genres,
    description,
    title,
    dateOfJam,
    userAvatar
  } = req.body;
  try {
    jam = new Jam({
      "user.userId": userId,
      "user.displayName": displayName,
      "user.avatar": userAvatar,
      title,
      description,
      genres,
      location,
      dateOfJam,
      usersGoing: [{ userId, displayName }]
    });
    await jam.save();
    return res.status(200).json(jam);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// Update a jam
router.put("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { location, genres, description, title } = req.body;
  try {
    let jam = await Jam.updateOne({
      _id: id,
      location,
      genres,
      description,
      title
    });
    return res.status(200).json(jam);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
