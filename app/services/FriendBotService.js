const fetch = require('node-fetch');
const Console = require('Console');
require('dotenv').config();

fundingLumen = async (publicKey) => {
  try {
    const response = await fetch(
      `${process.env.STELLAR_FRIENDBOT_URI}${publicKey}`
    );
    const data = await response.json();
    Console.success(
      `( FriendBotService.js ) - fundingLumen return successfully `
    );
    return data;
  } catch (e) {
    Console.error(e.message);
  }
};

module.exports = { fundingLumen };
