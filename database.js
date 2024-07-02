const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

const DATABASE_URL = process.env.URL;
class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(DATABASE_URL)

      .then(() => {
        console.log('Database connection successful...');
      })
      .catch((err) => {
        console.log('Database connection error ' + err);
      });
  }
}

module.exports = new Database();
