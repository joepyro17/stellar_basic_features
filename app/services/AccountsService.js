const StellarSDK = require('stellar-sdk');
const User = require('../models/User');
require('dotenv').config();

getAccountDetailByPublicKey = async (publicKey) => {
  try {
    // Get detail from User collections
    const user = await User.find({ public_key: publicKey });

    // Get detail from stellar blockchain
    const server = new StellarSDK.Server(process.env.STELLAR_HORIZON_TESTNET);
    const account = await server.loadAccount(publicKey);

    return { success: true, body: { user, accounts: account.balances } };
  } catch (e) {
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

    return { success: true, body: { user, accounts: account.balances } };
  } catch (e) {
    console.log(e);
    return { success: false, error: e.message };
  }
};

module.exports = { getAccountDetailByPublicKey, getAccountDetailByEmail };
