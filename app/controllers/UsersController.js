const Console = require('Console');
const usersService = require('../services/UsersService');

// Return all users
index = async (req, res) => {
  try {
    const allUser = await usersService.getAllUser();
    Console.success(`Get all Users return successfully`);
    return res.send(allUser);
  } catch (e) {
    Console.error(e.message());
    return res.status(500).send(e.message);
  }
};

module.exports = { index };
