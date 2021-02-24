const User = require('../models/User');
require('dotenv').config();

getAllUser = async () => {
  try {
    const users = await User.find();
    return { success: true, body: users };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

module.exports = { getAllUser };
