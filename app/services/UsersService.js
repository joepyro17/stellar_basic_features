const StellarSDK = require('stellar-sdk');
const User = require('../models/User');
const FriendBot = require('./FriendBot');
require('dotenv').config();

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
    FriendBot.fundingLumen(pair.publicKey()).then((r) => {
      console.log(r);
    });

    const newUser = await user.save();
    return { success: true, body: newUser };
  } catch (e) {
    return { success: false, error: e.message };
  }
};

module.exports = { getAllUser, createNewUser };
