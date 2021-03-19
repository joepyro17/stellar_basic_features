const StellarSDK = require('stellar-sdk');
const Console = require('Console');
const User = require('../models/User');
require('dotenv').config();

getAccountDetailByPublicKey = async (req) => {
  try {
    // Get detail from User collections
    const user = await User.findOne({ public_key: req.body.public_key }).select('-password');

    // Get detail from stellar blockchain
    const server = new StellarSDK.Server(process.env.STELLAR_HORIZON_TESTNET);
    const account = await server.loadAccount(user.public_key);

    Console.success(
      `( AccountsService.js ) - getAccountDetailByPublicKey return successfully `
    );
    return { success: true, body: { user, accounts: account.balances } };
  } catch (e) {
    Console.error(e.message);
    return { success: false, error: e.message };
  }
};

getAccountDetailByEmail = async (req) => {
  try {
    // Get detail from User collections
    const user = await User.findOne({ email: req.body.email }).select('-password');

    // Get detail from stellar blockchain
    const server = new StellarSDK.Server(process.env.STELLAR_HORIZON_TESTNET);
    Console.stress(user);
    const account = await server.loadAccount(user.public_key);

    Console.success(
      `( AccountsService.js ) - getAccountDetailByEmail return successfully `
    );
    return { success: true, body: { user, accounts: account.balances } };
  } catch (e) {
    Console.error(e.message);
    return { success: false, error: e.message };
  }
};

module.exports = { getAccountDetailByPublicKey, getAccountDetailByEmail };
