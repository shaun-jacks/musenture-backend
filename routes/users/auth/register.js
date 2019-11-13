const express = require("express");
const router = express.Router();
const User = require("../../../models/users");
const _ = require("lodash");
const Joi = require("@hapi/joi");

// Create validation objects
// Validate Email
const emailSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required()
});
const validateEmail = email => {
  const { error } = emailSchema.validate({ email });
  return error;
};

// Validate Passwords
// Create set password form validation
const complexityMethod = (value, helpers) => {
  if (!value.match(/[A-Z]+/)) {
    throw new Error("password must have at least one uppercase.");
  }

  if (!value.match(/[a-z]+/)) {
    throw new Error("password must have at least one lowercase");
  }

  if (!value.match(/[0-9]+/)) {
    throw new Error("password must have at least one number");
  }

  if (!value.match(/[!@#$^%&]+/)) {
    throw new Error("password must have at least one symbol: '!@#$%^&'.");
  }

  return value;
};

const setPasswordSchema = Joi.object().keys({
  password: Joi.string()
    .min(5)
    .required()
    .label("Password")
    .custom(complexityMethod, "Password Complexity"),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .label("Confirmed Password")
});

const validateSetPassword = (password, confirmPassword) => {
  const { error } = setPasswordSchema.validate({ password, confirmPassword });
  return error;
};

const setDisplayName = Joi.object().keys({
  displayName: Joi.string()
    .min(3)
    .max(20)
    .required()
    .label("Display Name")
});

const validateDisplayName = displayName => {
  const { error } = setDisplayName.validate({ displayName });
  return error;
};

// /users/auth/register
router.post("/", async (req, res) => {
  const { email, password, password2, displayName } = req.body;
  // Validate Email Body
  let error = validateEmail(email);
  if (error) {
    const errMsg = error.details[0].message;
    return res.status(401).send({ error: errMsg });
  }
  // validate passwords
  error = validateSetPassword(password, password2);
  if (error) {
    const errMsg = error.details[0].message;
    return res.status(401).send({ error: errMsg });
  }
  // validate display name
  error = validateDisplayName(displayName);
  if (error) {
    const errMsg = error.details[0].message;
    return res.status(401).send({ error: errMsg });
  }

  // Search if user already exists in database
  let user = await User.findOne({ email }).exec();
  if (_.isEmpty(user)) {
    // Create new user to save in db
    user = await new User({ email, displayName });
    // Hash Password
    const hashedPassword = await user.generateHashPassword(password);
    user.hashedPassword = hashedPassword;
    // Save user to database
    try {
      user = await user.save();
      return res
        .status(200)
        .json({ id: user._id, diplayName: user.displayName });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ err });
    }
  }
  // User already registered
  return res.status(400).json({ err: "user already registered" });
});

module.exports = router;
