const express = require("express");
const app = express();
const mongoConnect = require("./models");
const passport = require("passport");
const helmet = require("helmet");
const cors = require("cors");
// const whitelist = [
//   "https://localhost:3001",
//   "http://localhost:3001",
//   "http://localhost"
// ];

// const corsOptions = {
//   origin: function(origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   exposedHeaders: ["x-auth-token"]
// };
// app.use(cors(corsOptions));

const usersRoutes = require("./routes/users");
const jamsRoutes = require("./routes/jams");

require("dotenv").config();
require("./config/auth/facebook");

// Initialize db connection
const connection = mongoConnect();
connection
  .on("error", console.log)
  .on("disconnected", mongoConnect)
  .once("open", async () => {
    const PORT = process.env.PORT || "3000";
    app.listen(PORT, console.log(`Server started on port ${PORT}`));
  });

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
