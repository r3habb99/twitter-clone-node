const express = require("express");
const router = express.Router();
// const bodyParser = require("body-parser");
const { logger } = require("../utils/logger");
const { findUser } = require("../repositories/userRepository");
const { comparePassword } = require("../utils/bcryptService");
const { createAndSaveToken } = require("../repositories/tokenRepository");

// router.use(bodyParser.urlencoded({ extended: false }));

// Named function to render login page
const renderLoginPage = (res, payload) => {
  res.status(200).render("login", payload);
};

// Named function for validating credentials
const validateCredentials = async (usernameOrEmail, password) => {
  const user = await findUser(usernameOrEmail);

  if (!user) return null;

  const isPasswordValid = await comparePassword(password, user.password);
  return isPasswordValid ? user : null;
};

// Route to render login page
router.get("/", (req, res) => {
  renderLoginPage(res, {});
});

// Route to handle login logic
router.post("/", async (req, res) => {
  const { logUsername, logPassword } = req.body;
  const payload = {};

  if (logUsername && logPassword) {
    try {
      const user = await validateCredentials(logUsername, logPassword);

      if (user) {
        const token = await createAndSaveToken(user);

        req.session.user = user;
        req.session.token = token; // Store the token in the session

        return res.redirect("/"); // Redirect to home page
      }

      logger.info("Login credentials incorrect.");
      payload.errorMessage = "Login credentials incorrect.";
      return renderLoginPage(res, payload);
    } catch (error) {
      console.error(error);
      payload.errorMessage = "Something went wrong.";
      return renderLoginPage(res, payload);
    }
  }

  payload.errorMessage = "Make sure each field has a valid value.";
  return renderLoginPage(res, payload);
});

module.exports = router;
