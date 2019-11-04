const express = require("express");
const router = express.Router(); // /users/auth/facebook
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("facebook", { scope: ["email"], session: false })
);

router.get(
  "/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/login",
    sucessRedirect: "/"
  }),
  async (req, res) => {
    const token = await req.user.generateAuthToken();
    res.send(token);
  }
);

module.exports = router;
