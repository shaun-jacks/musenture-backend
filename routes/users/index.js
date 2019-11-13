const express = require("express");
const router = express.Router();
const facebookAuth = require("./auth/facebook");
const localAuth = require("./auth/local");
const registerRoutes = require("./auth/register");

const userRoutes = require("./user");

// Authentication Routes
router.use("/auth/register", registerRoutes);
router.use("/auth/facebook", facebookAuth);
router.use("/auth/local", localAuth);

// Users routes
router.use(userRoutes);

module.exports = router;
