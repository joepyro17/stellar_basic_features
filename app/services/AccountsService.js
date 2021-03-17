const StellarSDK = require('stellar-sdk');
const Console = require('Console');
const User = require('../models/User');
require('dotenv').config();

getAccountDetailByPublicKey = async (publicKey) => {
  try {
    // Get detail from User collections
    const user = await User.find({ public_key: publicKey });

    // Get detail from stellar blockchain
    const server = new StellarSDK.Server(process.env.STELLAR_HORIZON_TESTNET);
    const account = await server.loadAccount(publicKey);

    Console.success(
      `( AccountsService.js ) - getAccountDetailByPublicKey return successfully `
    );
    return { success: true, body: { user, accounts: account.balances } };
  } catch (e) {
    Console.error(e.message());
    return { success: false, error: e.message };
  }
};

getAccountDetailByEmail = async (req) => {
  try {
    // Get detail from User collections
    const user = await User.findOne({ email: req.body.email });

    // Get detail from stellar blockchain
    const server = new StellarSDK.Server(process.env.STELLAR_HORIZON_TESTNET);
    const account = await server.loadAccount(user.public_key);

    Console.success(
      `( AccountsService.js ) - getAccountDetailByEmail return successfully `
    );
    return { success: true, body: { user, accounts: account.balances } };
  } catch (e) {
    Console.error(e.message());
    return { success: false, error: e.message };
  }
};

module.exports = { getAccountDetailByPublicKey, getAccountDetailByEmail };
