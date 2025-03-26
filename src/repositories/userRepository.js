const User = require("../schemas/UserSchema");
const { logger } = require("../utils/logger");

// Function to find user by username or email
const findUser = async (usernameOrEmail) => {
  try {
    return await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
  } catch (error) {
    logger.error("Error finding user: ", error);
    throw new Error("Database query failed: " + error.message);
  }
};


// Function to find a user by username or email
// const findUserByUsernameOrEmail = async (username, email) => {
//     try {
//       return await User.findOne({
//         $or: [{ username: username }, { email: email }],
//       });
//     } catch (error) {
//       throw new Error("Error querying the database: " + error.message);
//     }
//   };
  
  // Function to create a new user
  const createUser = async (userData) => {
    try {
      const newUser = await User.create(userData);
      return newUser;
    } catch (error) {
      throw new Error("Error creating user: " + error.message);
    }
  };

module.exports = {
  findUser,
};
