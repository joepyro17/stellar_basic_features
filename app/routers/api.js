const express = require('express');
const usersController = require('../controllers/UsersController');

const router = express.Router();

// Users
// Get all users
router.get('/api/users', usersController.index);
// Create a new user
router.post('/api/users', usersController.store);

module.exports = router;
