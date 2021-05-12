const express = require('express');
const usersController = require('../controllers/UsersController');
const accountsController = require('../controllers/AccountsController');
const paymentsController = require('../controllers/PaymentsController');
const assetsController = require('../controllers/AssetsController');

const router = express.Router();

// Users
// Get all users
router.get('/users', usersController.index);
// Get account detail by public key
router.post(
  '/account_detail_by_public_key',
  accountsController.accountDetailByPublicKey
);
// Get account detail by email
router.post(
  '/account_detail_by_username',
  accountsController.accountDetailByEmail
);
// Transaction
router.post('/transaction_history', accountsController.transactionHistory);

// Send Payment
router.post('/send_payment', paymentsController.sendPayment);
// Create Asset
router.post('/create_asset', assetsController.createAsset);



module.exports = router;
