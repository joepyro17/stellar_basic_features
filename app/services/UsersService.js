const Console = require('Console');
const User = require('../models/User');
require('dotenv').config();

getAllUser = async () => {
  try {
    const users = await User.find().select('-password');
    Console.success(`( UsersService.js ) - getAllUser return successfully `);
    return { success: true, body: users };
  } catch (e) {
    Console.error(e.message);
    return { success: false, error: e.message };
  }
};

module.exports = { getAllUser };
