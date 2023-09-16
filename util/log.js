const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");
const { failure } = require("../util/common");

class LogClass {
  logMessage(message) {
    console.log(message);
    // Get the current date and time in ISO format
    const currentTime = new Date().toISOString();

    const dateObj = new Date(currentTime);

    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // Months are 0-indexed, so add 1
    const day = dateObj.getDate();
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    const second = dateObj.getSeconds();

    // Create the log entry with ISO date and time
    const logEntry = `${message} || Date: ${day}/${month}/${year} || Time: ${hour}:${minute}:${second} BST`;

    // Append the log entry to the log file
    fs.appendFile(
      path.join(__dirname, "..", "data", "logFile.txt"),
      logEntry + "\n",
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing to log file:", err);
        } else {
          console.log("Log entry written successfully.");
        }
      }
    );
  }
}

module.exports = new LogClass();
