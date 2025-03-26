const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const User = require("../../schemas/UserSchema");
const Chat = require("../../schemas/ChatSchema");
const Message = require("../../schemas/MessageSchema");
const Notification = require("../../schemas/NotificationSchema");

app.use(bodyParser.urlencoded({ extended: false }));

router.post(
  "/",
  [
    // Validate and sanitize input
    check("content").trim().notEmpty().withMessage("Content is required"),
    check("chatId").trim().isMongoId().withMessage("Invalid chat ID"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    let newMessage = {
      sender: req.session.user._id,
      content: req.body.content,
      chat: req.body.chatId,
    };

    Message.create(newMessage)
      .then(async (createdMessage) => {
        // Fetch the created message as a Mongoose document and populate fields
        let message = await Message.findById(createdMessage._id)
          .populate("sender")
          .populate("chat")
          .populate({
            path: "chat.users", // Populate nested users in the chat
            model: "User",
          });

        let chat = await Chat.findByIdAndUpdate(req.body.chatId, {
          latestMessage: message,
        }).catch((error) => console.log(error));

        insertNotifications(chat, message);
        res.status(201).send(message);
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(400);
      });
  }
);

function insertNotifications(chat, message) {
  chat.users.forEach((userId) => {
    if (userId == message.sender._id.toString()) return;

    Notification.insertNotification(
      userId,
      message.sender._id,
      "newMessage",
      message.chat._id
    );
  });
}

module.exports = router;
