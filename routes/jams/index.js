const express = require("express");
const router = express.Router();
const Jam = require("../../models/jams");
const _ = require("lodash");

router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { location, genres, description, title } = req.body;
  jam = new Jam({
    userId: id,
    title,
    description,
    genres,
    location
  });
  await jam.save();
  return res.status(200).json(jam);
});

module.exports = router;
