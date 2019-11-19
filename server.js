const { initDatabase } = require("./models");
const config = require("config")[process.env.NODE_ENV || "development"];
let server = require("./app.js");

initDatabase();
