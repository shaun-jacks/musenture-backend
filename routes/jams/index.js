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
  let jam = await Jam.findOne({ id }).exec();
  if (_.isEmpty(jam)) {
    return res.status(400).json({ error: "Jam not found" });
  }
  return res.status(200).json(jam);
});

/* Protected Routes */

// Create a jam
router.post("/", authenticate, async (req, res) => {
  const { id: userId } = req.user;
  const { location, genres, description, title } = req.body;
  try {
    jam = new Jam({
      userId,
      title,
      description,
      genres,
      location
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
