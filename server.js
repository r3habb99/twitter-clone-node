// const express = require('express');
// const app = express();
// const port = 3000;
// const middleware = require('./middlewares/authMiddleware');
// const path = require('path');
// const bodyParser = require('body-parser');
// const mongoose = require('./database');
// const session = require('express-session');

// const server = app.listen(port, () => {
//   const protocol = 'http';
//   const host = 'localhost';
//   console.log(`Server is up and running at ${protocol}://${host}:${port}/`);
// });

// app.set('view engine', 'pug');
// app.set('views', 'views');

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

// app.use(
//   session({
//     secret: 'bbq chips',
//     resave: true,
//     saveUninitialized: false,
//   })
// );

// // Routes
// const loginRoute = require('./routes/loginRoutes');
// const registerRoute = require('./routes/registerRoutes');
// // Api Routes
// const postsApiRoute = require('./routes/api/posts');

// app.use('/login', loginRoute);
// app.use('/register', registerRoute);

// app.use('/api/posts', postsApiRoute);

// app.get('/', middleware.requireLogin, (req, res, next) => {
//   let payload = {
//     pageTitle: 'Home',
//     userLoggedIn: req.session.user,
//     userLoggedInJs: JSON.stringify(req.session.user),
//   };

//   res.status(200).render('home', payload);
// });
const express = require('express');
const app = express();
const port = 3000;
const middleware = require('./middlewares/authMiddleware');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('./database');
const session = require('express-session');

const server = app.listen(port, () => {
  const protocol = 'http';
  const host = 'localhost';
  console.log(`Server is up and running at ${protocol}://${host}:${port}/`);
});

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'bbq chips',
    resave: true,
    saveUninitialized: false,
  })
);

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const postRoute = require('./routes/postRoutes');

// Api routes
const postsApiRoute = require('./routes/api/posts');

app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/posts', middleware.requireLogin, postRoute);

app.use('/api/posts', postsApiRoute);

app.get('/', middleware.requireLogin, (req, res, next) => {
  let payload = {
    pageTitle: 'Home',
    userLoggedIn: req.session.user,
    userLoggedInJs: JSON.stringify(req.session.user),
  };

  res.status(200).render('home', payload);
});
