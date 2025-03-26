const express = require("express");
const router = express.Router();
const Token = require("../schemas/TokenSchema");

router.get("/", async (req, res) => {
  try {
    const token = req.session.token;

    if (token) {
      // Delete the token from the database
      await Token.findOneAndDelete({ token });
    }

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Internal Server Error");
      }

      // Redirect to the login page
      res.redirect("/login");
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
