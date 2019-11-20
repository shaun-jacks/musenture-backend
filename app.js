const express = require("express");
const app = express();
const passport = require("passport");
const helmet = require("helmet");
const cors = require("cors");
const config = require("config")[process.env.NODE_ENV || "development"];

const whitelist = [
  "https://localhost:3001",
  "http://localhost:3001",
  "http://localhost",
  "https://localhost",
  "https://localhost:3000",
  config.get("client_uri")
];

const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  exposedHeaders: ["x-auth-token"]
};
//==================================//
// Disable cors when running tests //
//==================================//
// app.use(cors(corsOptions));

const usersRoutes = require("./routes/users");
const jamsRoutes = require("./routes/jams");

require("./passport/auth/facebook");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Add helmet
app.use(helmet());

// // Add user routes
app.use("/users", usersRoutes);
// // Add jam routes
app.use("/jams", jamsRoutes);

app.get("/", async (req, res) => {
  return res.status(200).send("Hello!");
});

const PORT = config.get("port");

module.exports = app.listen(
  process.env.PORT || PORT || "3000",
  console.log(`Server started on port ${PORT}`)
);
