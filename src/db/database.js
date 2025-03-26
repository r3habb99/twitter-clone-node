const mongoose = require("mongoose");
const { logger } = require("../utils/logger");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
module.exports = { connectDB };
