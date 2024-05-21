const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.set('views', 'src/views');

app.get('/', (req, res) => {
  let payload = {
    pageTitle: 'Home',
  };

  res.status(200).render('home', payload);
});



const server = app.listen(port, () => {
  const protocol = 'http';
  const host = 'localhost';
  console.log(`Server is up and running at ${protocol}://${host}:${port}/`);
});
