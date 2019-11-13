const express = require("express");
const router = express.Router();
const User = require("../../../models/users");
const _ = require("lodash");

const { validateLogin } = require("../../../helpers/validators");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const error = validateLogin(email, password);
  if (error) {
    const errMsg = error.details[0].message;
    return res.status(401).send({ error: errMsg });
  }
  const user = await User.findOne({ email }).exec();
  if (_.isEmpty(user))
    return res.status(401).send({ error: "Invalid email or password" });
  if (user.facebook || user.google) {
    return res
      .status(400)
      .send(
        "Email already registered with another provider, login with Facebook or Google"
      );
  }
  const validPassword = await user.validatePassword(password);
  if (!validPassword)
    return res.status(401).send({ error: "Invalid email or password" });
  const token = await user.generateAuthToken();
  res.status(200).send(token);
});

module.exports = router;
