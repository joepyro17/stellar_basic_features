const express = require('express');
const usersController = require('../controllers/UsersController');
const accountsController = require('../controllers/AccountsController');

const router = express.Router();

// Users
// Get all users
router.get('/api/users', usersController.index);
// Create a new user
router.post('/api/users', usersController.store);
// Get account detail
router.get(
  '/api/account_detail/:public_key',
  accountsController.accountDetailByPublicKey
);

module.exports = router;
