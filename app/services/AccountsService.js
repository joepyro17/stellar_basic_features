const StellarSDK = require('stellar-sdk');
const Console = require('Console');
const User = require('../models/User');
require('dotenv').config();

getAccountDetailByPublicKey = async (req) => {
  try {
    // Get detail from User collections
    const user = await User.findOne({ public_key: req.body.public_key }).select(
      '-password'
    );

    // Get detail from stellar blockchain
    const server = new StellarSDK.Server(process.env.STELLAR_HORIZON_TESTNET);
    const account = await server.loadAccount(user.public_key);

    Console.success(
      `( AccountsService.js ) - getAccountDetailByPublicKey return successfully `
    );
    return {
      success: true,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'Access-Control-Allow-Headers':
          'Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: { user, accounts: account.balances },
    };
  } catch (e) {
    Console.error(e.message);
    return { success: false, error: e.message };
  }
};

getAccountDetailByEmail = async (req) => {
  try {
    // Get detail from User collections
    const user = await User.findOne({ email: req.body.email }).select(
      '-password'
    );

    // Get detail from stellar blockchain
    const server = new StellarSDK.Server(process.env.STELLAR_HORIZON_TESTNET);
    Console.stress(user);
    const account = await server.loadAccount(user.public_key);

    Console.success(
      `( AccountsService.js ) - getAccountDetailByEmail return successfully `
    );
    return {
      success: true,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'Access-Control-Allow-Headers':
          'Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: { user, accounts: account.balances },
    };
  } catch (e) {
    Console.error(e.message);
    return { success: false, error: e.message };
  }
};

getTransactionHistory = async (req) => {
  try {
    // Get detail from stellar blockchain
    const server = new StellarSDK.Server(process.env.STELLAR_HORIZON_TESTNET);
    let records;
    await server
      .transactions()
      .forAccount(req.body.public_key)
      .call()
      .then((page) => {
        records = page.records;
      })
      .catch((err) => {
        return { success: false, error: err };
      });

    console.log(records);
    return {
      success: true,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'Access-Control-Allow-Headers':
          'Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: records,
    };
  } catch (e) {
    Console.error(e.message);
    return { success: false, error: e.message };
  }
};

module.exports = {
  getAccountDetailByPublicKey,
  getAccountDetailByEmail,
  getTransactionHistory,
};
