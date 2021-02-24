const StellarSDK = require('stellar-sdk');
require('dotenv').config();

getAccountDetailByPublicKey = async (publicKey) => {
  try {
    const server = new StellarSDK.Server(process.env.STELLAR_HORIZON_TESTNET);

    const account = await server.loadAccount(publicKey);

    return { success: true, body: account };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

module.exports = { getAccountDetailByPublicKey };
