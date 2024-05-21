const express = require('express');
const app = express();
const port = 3000;
const authMiddleware = require('./middlewares/authMiddleware');
const path = require('path');
const bodyParser = require('body-parser');

const server = app.listen(port, () => {
  const protocol = 'http';
  const host = 'localhost';
  console.log(`Server is up and running at ${protocol}://${host}:${port}/`);
});

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');

app.use('/login', loginRoute);
app.use('/register', registerRoute);

app.get('/', authMiddleware.requireLogin, (req, res, next) => {
  let payload = {
    pageTitle: 'Home',
  };

  res.status(200).render('home', payload);
});
