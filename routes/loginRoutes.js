const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../schemas/UserSchema');
const Token = require('../schemas/TokenSchema');

router.use(bodyParser.urlencoded({ extended: false }));

const jwtSecret = process.env.JWT_SECRET || 'my_secret_twitter';

router.get('/', (req, res) => {
  res.status(200).render('login');
});

router.post('/', async (req, res) => {
  let payload = req.body;

  if (req.body.logUsername && req.body.logPassword) {
    try {
      let user = await User.findOne({
        $or: [
          { username: req.body.logUsername },
          { email: req.body.logUsername },
        ],
      });

      if (user != null) {
        let result = await bcrypt.compare(req.body.logPassword, user.password);

        if (result === true) {
          const token = jwt.sign({ userId: user._id }, jwtSecret, {
            expiresIn: '30m',
          });

          const newToken = new Token({
            userId: user._id,
            token: token,
          });

          await newToken.save();

          req.session.user = user;
          req.session.token = token; // Store the token in the session

          return res.redirect('/'); // Redirect to home page
        }
      }

      payload.errorMessage = 'Login credentials incorrect.';
      return res.status(200).render('login', payload);
    } catch (error) {
      console.log(error);
      payload.errorMessage = 'Something went wrong.';
      return res.status(200).render('login', payload);
    }
  }

  payload.errorMessage = 'Make sure each field has a valid value.';
  res.status(200).render('login', payload);
});

module.exports = router;
