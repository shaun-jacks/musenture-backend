const express = require("express");
const router = express.Router(); // /users/auth/facebook
const passport = require("passport");

router.post(
  "/",
  passport.authenticate("facebookToken", { scope: ["email"], session: false }),
  async (req, res) => {
    const token = await req.user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .status(200)
      .json({ success: true });
  }
);

module.exports = router;
