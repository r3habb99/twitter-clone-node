const { createLogger, format, transports } = require("winston");
const path = require("path");
const fs = require("fs");

const logDirectory = path.join(process.cwd(), "bin");

// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(logDirectory, "info.log"),
      level: "info",
    }),
    new transports.File({ filename: path.join(logDirectory, "combined.log") }),
    new transports.Console(),
  ],
});
module.exports = { logger };
// #URL=mongodb+srv://rishabhprajapati411:admin%402024@mongodatabases.0viaodk.mongodb.net/twitter-clone-dev
