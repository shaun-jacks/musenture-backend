const app = require("./app.js");
const { mongoConnect } = require("./models");
const config = require("config")[process.env.NODE_ENV || "development"];

function initDatabase(app) {
  // Initialize db connection
  const connection = mongoConnect();
  connection
    .on("error", console.log)
    .on("disconnected", mongoConnect)
    .once("open", async () => {
      const PORT = config.get("port");
      app.listen(PORT, console.log(`Server started on port ${PORT}`));
    });
}

initDatabase(app);

module.exports = initDatabase;
