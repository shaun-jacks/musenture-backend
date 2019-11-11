const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JamSchema = new Schema(
  {
    user: {
      userId: {
        type: String,
        default: "",
        index: true,
        required: [true, "Must have user id"]
      },
      displayName: {
        type: String,
        default: ""
      },
      avatar: {
        type: String,
        default: ""
      }
    },
    dateOfJam: {
      type: Date
    },
    title: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    genres: [String],
    description: {
      type: String,
      default: ""
    },
    usersGoing: [
      {
        userId: { type: String, default: "" },
        displayName: { type: String, default: "" },
        instrument: { type: String, default: "" }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Jam", JamSchema);
