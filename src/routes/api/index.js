const express = require("express");

const router = express();

// Api routes
const postsApiRoute = require("./posts");
const usersApiRoute = require("./users");
const chatsApiRoute = require("./chats");
const messagesApiRoute = require("./messages");
const notificationsApiRoute = require("./notifications");

// Routes
router.use("/api/posts", postsApiRoute);
router.use("/api/users", usersApiRoute);
router.use("/api/chats", chatsApiRoute);
router.use("/api/messages", messagesApiRoute);
router.use("/api/notifications", notificationsApiRoute);

module.exports = router;
