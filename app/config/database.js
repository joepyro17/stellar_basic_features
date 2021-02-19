const mongoose = require('mongoose');

require('dotenv').config();

createConnection = () => {
  try {
    mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.debug('Connect Database Successfully');
  } catch (e) {
    console.error(e);
  }
};

module.exports = { createConnection };
