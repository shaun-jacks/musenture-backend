const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
    providers: {
      facebook: { type: Boolean, default: false },
      google: { type: Boolean, default: false }
    },
    hashedPassword: {
      type: String
    },
    displayName: { type: String, default: "" },
    bio: {
      type: String,
      default: ""
    },
    instrument: {
      type: String,
      enum: [
        "guitar",
        "piano",
        "voice",
        "drums",
        "dj",
        "percussion",
        "bass",
        "violin",
        "horns",
        "winds"
      ]
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

UserSchema.methods.generateHashPassword = async function(password) {
  return new Promise((resolve, reject) => {
    const SALT = 12;
    // generate a salt
    bcrypt.genSalt(SALT, (err, salt) => {
      if (err) return reject(err);

      // hash the password along with our new salt
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return reject(err);
        return resolve(hash);
      });
    });
  });
};

UserSchema.methods.validatePassword = async function(candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(
      candidatePassword,
      this.hashedPassword
    );
    return isMatch;
  } catch (err) {
    return err;
  }
};

module.exports = mongoose.model("User", UserSchema);
