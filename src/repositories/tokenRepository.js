const jwt = require("jsonwebtoken");
const Token = require("../schemas/TokenSchema");

const jwtSecret = process.env.JWT_SECRET || "my_secret_twitter";

// Function to create and save the JWT token
const createAndSaveToken = async (user) => {
  const token = jwt.sign({ userId: user._id }, jwtSecret, {
    expiresIn: "30m",
  });

  const newToken = new Token({
    userId: user._id,
    token: token,
  });

  await newToken.save();
  return token;
};

module.exports = {
  createAndSaveToken,
};
