const express = require("express");
const middleware = require("../middlewares/authMiddleware");

const router = express();

// Routes
const loginRoute = require("./loginRoutes");
const logoutRoute = require("./logoutRoutes");
const registerRoute = require("./registerRoutes");
const postRoute = require("./postRoutes");
const profileRoute = require("./profileRoutes");
const uploadRoute = require("./uploadRoutes");
const searchRoute = require("./searchRoutes");
const messagesRoute = require("./messagesRoutes");
const notificationsRoute = require("./notificationsRoute");

router.use("/login", loginRoute);
router.use("/register", registerRoute);
router.use("/posts", middleware.requireLogin, postRoute);
router.use("/profile", middleware.requireLogin, profileRoute);
router.use("/uploads", uploadRoute);
router.use("/search", middleware.requireLogin, searchRoute);
router.use("/messages", middleware.requireLogin, messagesRoute);
router.use("/notifications", middleware.requireLogin, notificationsRoute);
router.use("/logout", logoutRoute);

module.exports = router;
