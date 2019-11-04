const mongoose = require("mongoose");

module.exports = () => {
  // DB Connection
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  mongoose.connect(process.env.mongodbUrl, options);
  return mongoose.connection;
};
