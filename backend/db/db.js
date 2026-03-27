const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async () => {
  try {
    console.log("hi")
    
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      "Database connected: ",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.error("DB ERROR:", err.message);
    process.exit(1);
  }
};

module.exports = connectDb;