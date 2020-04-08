const config = require("./default");
const uri = config.ConnectionUrl;
const mongoose = require("mongoose");
//const client = new MongoClient(uri, { useNewUrlParser: true });

const connectDatabase = async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true });
    console.log("MongoDB is Connected...");
    //console.log(client);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

//Remove message about deprecated mongoose
mongoose.Promise = global.Promise;
module.exports = connectDatabase;
