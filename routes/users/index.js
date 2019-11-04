const express = require("express");
const router = express.Router();
const facebookAuth = require("./auth/facebook");
const userRoutes = require("./user");

router.use(userRoutes);

router.use("/auth/facebook", facebookAuth);

module.exports = router;
