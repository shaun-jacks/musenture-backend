const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JamSchema = new Schema(
  {
    userId: {
      type: String,
      default: "",
      index: true,
      required: [true, "Must have user id"]
    },
    title: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    genres: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Jam", JamSchema);
