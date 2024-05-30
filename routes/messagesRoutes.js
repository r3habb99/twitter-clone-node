const express = require('express');
const app = express();
const router = express.Router();
const Chat = require('../schemas/ChatSchema');

router.get('/', (req, res, next) => {
  let payload = {
    pageTitle: 'Inbox',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };
  res.status(200).render('inboxPage', payload);
});

router.get('/new', (req, res, next) => {
  let payload = {
    pageTitle: 'New message',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };
  res.status(200).render('newMessage', payload);
});

router.get('/:chatId', async (req, res, next) => {
  let userId = req.session.user._id;
  let chatId = req.params.chatId;

  let chat = await Chat.findOne({
    _id: chatId,
    users: { $elemMatch: { $eq: userId } },
  }).populate('users');

  if (chat == null) {
    // Check if chat id is really user id
  }

  res.status(200).render('chatPage', {
    pageTitle: 'Chat',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
    chat: chat,
  });
});

module.exports = router;
