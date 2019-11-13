const express = require("express");
const router = express.Router();
const User = require("../../../models/users");
const _ = require("lodash");
const {
  validateEmail,
  validateSetPassword,
  validateDisplayName
} = require("../../../helpers/validators");

// /users/auth/register
router.post("/", async (req, res) => {
  const { email, displayName, password, password2 } = req.body;
  console.log(email, displayName);
  // Validate Email Body
  let error = validateEmail(email);
  if (error) {
    const errMsg = error.details[0].message;
    console.log(errMsg);
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
