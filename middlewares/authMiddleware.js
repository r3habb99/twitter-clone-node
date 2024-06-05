const jwt = require('jsonwebtoken');
const Token = require('../schemas/TokenSchema');
const jwtSecret = process.env.JWT_SECRET || 'my_secret_twitter';

exports.requireLogin = async (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    const tokenEntry = await Token.findOne({
      userId: decoded.userId,
      token: token,
    });
    if (!tokenEntry) {
      return res.redirect('/login');
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.redirect('/login');
  }
};
