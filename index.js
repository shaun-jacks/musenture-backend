const express = require("express");
const app = express();
const cors = require("cors");
const mongoConnect = require("./models");
const passport = require("passport");
const helmet = require("helmet");
const User = require("./models/users");
const Jam = require("./models/jams");

const usersRoutes = require("./routes/users");
const jamsRoutes = require("./routes/jams");

require("dotenv").config();
require("./config/auth/facebook");

// const whitelist = ["http://localhost:3000"];
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
