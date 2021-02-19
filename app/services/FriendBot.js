const fetch = require('node-fetch');
require('dotenv').config();

fundingLumen = async (publicKey) => {
  const response = await fetch(
    `${process.env.STELLAR_FRIENDBOT_URI}${publicKey}`
  );
  const data = await response.json();
  return data;
};

module.exports = { fundingLumen };
