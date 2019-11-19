const mongoose = require("mongoose");
const config = require("config")[process.env.NODE_ENV || "development"];

const mongoConnect = () => {
  // DB Connection
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  mongoose.connect(config.get("db.mongo_url"), options);
  return mongoose.connection;
};

module.exports = {
  mongoConnect,
  mongoDisconnect: () => {
    return new Promise(async (resolve, reject) => {
      try {
        await mongoose.disconnect();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  },
  initDatabase: () => {
    // Initialize db connection
    const connection = mongoConnect();
    connection
      .on("error", console.log)
      .on("disconnected", mongoConnect)
      .once("open", async () => {
        console.log("Connected to mongodb");
      });
  }
};
