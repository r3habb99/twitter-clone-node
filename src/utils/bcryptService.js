const bcrypt = require("bcrypt");

// Function to hash a password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Function to compare the password
const comparePassword = async (inputPassword, storedPassword) => {
  return await bcrypt.compare(inputPassword, storedPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
