const mongoose = require("mongoose");
const config = require("config")[process.env.NODE_ENV || "development"];

module.exports = {
  mongoConnect: () => {
    // DB Connection
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    mongoose.connect(config.get("db.mongo_url"), options);
    return mongoose.connection;
  },
  mongoDisconnect: () => {
    mongoose.disconnect();
  }
};
