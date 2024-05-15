const express = require('express');
const app = express();
const port = 3000;
const server = app.listen(port, () => {
  const protocol = 'http';
  const host = 'localhost';
  console.log(`Server is up and running at ${protocol}://${host}:${port}/`);
});
