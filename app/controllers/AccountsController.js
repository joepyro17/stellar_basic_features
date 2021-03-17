const Console = require('Console');
const accountsService = require('../services/AccountsService');

accountDetailByPublicKey = async (req, res) => {
  try {
    const account = await accountsService.getAccountDetailByPublicKey(
      req.params.public_key
    );
    Console.success(`accountDetailByPublicKey return successfully`);
    return res.send(account);
  } catch (e) {
    Console.error(e.message());
    return res.status(500).send(e.message);
  }
};

accountDetailByEmail = async (req, res) => {
  try {
    const account = await accountsService.getAccountDetailByEmail(req);
    Console.success(`accountDetailByEmail return successfully`);
    return res.send(account);
  } catch (e) {
    Console.error(e.message());
    return res.status(500).send(e.message);
  }
};

module.exports = { accountDetailByPublicKey, accountDetailByEmail };
