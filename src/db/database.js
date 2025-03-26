// const mongoose = require('mongoose');
// require('dotenv').config();
// // mongoose.set('useNewUrlParser', true);
// // mongoose.set('useUnifiedTopology', true);
// // mongoose.set('useFindAndModify', false);

// const DATABASE_URL = process.env.URL;
// class Database {

//   connect() {
//     mongoose
//       .connect(DATABASE_URL)

//       .then(() => {
//         console.log('Database connection successful...');
//       })
//       .catch((err) => {
//         console.log('Database connection error ' + err);
//       });
//   }
// }

// module.exports = new Database();

const mongoose = require("mongoose");
const { logger } = require("../utils/logger");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
  } catch (error) {
    logger.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
module.exports = { connectDB };
