const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");
const upload = require("../utils/multer");
const fs = require("fs");
const path = require("path");

router.get("/", (req, res, next) => {
  let payload = {
    pageTitle: req.session.user.username,
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    profileUser: req.session.user,
  };

  res.status(200).render("profilePage", payload);
});

router.get("/:username", async (req, res, next) => {
  let payload = await getPayload(req.params.username, req.session.user);

  res.status(200).render("profilePage", payload);
});

router.get("/:username/replies", async (req, res, next) => {
  let payload = await getPayload(req.params.username, req.session.user);
  payload.selectedTab = "replies";

  res.status(200).render("profilePage", payload);
});

router.get("/:username/following", async (req, res, next) => {
  let payload = await getPayload(req.params.username, req.session.user);
  payload.selectedTab = "following";

  res.status(200).render("followersAndFollowing", payload);
});

router.get("/:username/followers", async (req, res, next) => {
  let payload = await getPayload(req.params.username, req.session.user);
  payload.selectedTab = "followers";

  res.status(200).render("followersAndFollowing", payload);
});

router.post(
  "/upload/profilePicture",
  upload.single("profilePicture"),
  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const imagesDir = path.join(__dirname, "../../uploads/images");
    const filePath = `/uploads/images/${req.file.filename}.png`;
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, `../../${filePath}`);

    // Ensure the directory exists
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    fs.rename(tempPath, targetPath, async (error) => {
      if (error) {
        console.log(error);
        return res.sendStatus(400);
      }

      try {
        // Update the user's profile picture in the database
        req.session.user = await User.findByIdAndUpdate(
          req.session.user._id,
          { profilePic: filePath },
          { new: true }
        );

        res.status(200).send({ filePath });
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
    });
  }
);

async function getPayload(username, userLoggedIn) {
  let user = await User.findOne({ username: username });

  if (user == null) {
    user = await User.findById(username);

    if (user == null) {
      return {
        pageTitle: "User not found",
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn),
      };
    }
  }

  return {
    pageTitle: user.username,
    userLoggedIn: userLoggedIn,
    userLoggedInJs: JSON.stringify(userLoggedIn),
    profileUser: user,
  };
}

module.exports = router;
