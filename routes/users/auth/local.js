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

// /users/auth/register
router.post("/", async (req, res) => {});

module.exports = router;
