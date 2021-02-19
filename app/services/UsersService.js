const StellarSDK = require('stellar-sdk');
const fetch = require('node-fetch');
const User = require('../models/User');

getAllUser = async () => {
  try {
    const users = await User.find();
    return { success: true, body: users };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

createNewUser = async (req) => {
  try {
    const user = new User();
    user.name = req.body.name;
    user.age = req.body.age;

    // create a new keypair public and secret key
    const pair = StellarSDK.Keypair.random();
    console.debug('Keypair was generated');
    console.debug(`Public Key: ${pair.publicKey()}`);
    console.debug(`Secret Key: ${pair.secret()}`);
    user.public_key = pair.publicKey();
    user.secret_key = pair.secret();

    // Funding some lumen
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${pair.publicKey()}`
    );
    const data = await response.json();
    console.warn(data);

    const newUser = await user.save();
    return { success: true, body: newUser };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

module.exports = { getAllUser, createNewUser };
