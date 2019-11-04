const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      index: true,
      required: [true, "Must have email"]
    },
    displayName: { type: String, default: "" },
    bio: {
      type: String,
      default: ""
    },
    instrument: {
      type: String,
      default: ""
    },
    skill: {
      type: String,
      default: ""
    },
    avatar: {
      type: String,
      default: ""
    },
    // Will be strings of user ids
    following: [String],
    followers: [String]
  },
  {
    timestamps: true
  }
);

UserSchema.methods.generateAuthToken = async function() {
  const token = await jwt.sign(
    {
      id: this._id,
      displayName: this.displayName
    },
    process.env.secret,
    {
      expiresIn: "12h"
    }
  );
  return token;
};

module.exports = mongoose.model("User", UserSchema);
