const usersService = require('../services/UsersService');

// Return all users
index = async (req, res) => {
  try {
    const allUser = await usersService.getAllUser();
    return res.send(allUser);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

// Create a new user
store = async (req, res) => {
  try {
    const result = await usersService.createNewUser(req);
    return res.send(result);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

module.exports = { index, store };
