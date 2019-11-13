const express = require("express");
const router = express.Router();
const facebookAuth = require("./auth/facebook");
const registerRoutes = require("./auth/register");

const userRoutes = require("./user");

router.use("/auth/register", registerRoutes);
router.use(userRoutes);
router.use("/auth/facebook", facebookAuth);

module.exports = router;
