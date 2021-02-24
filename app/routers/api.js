const express = require('express');
const usersController = require('../controllers/UsersController');
const accountsController = require('../controllers/AccountsController');
const paymentsController = require('../controllers/PaymentsController');

const router = express.Router();

// Users
// Get all users
router.get('/users', usersController.index);
// Get account detail
router.get(
  '/account_detail/:public_key',
  accountsController.accountDetailByPublicKey
);
// Send Payment
router.post('/send_payment', paymentsController.sendPayment);

module.exports = router;
