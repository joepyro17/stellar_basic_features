const accountsService = require('../services/AccountsService');

accountDetailByPublicKey = async (req, res) => {
  try {
    const account = await accountsService.getAccountDetailByPublicKey(
      req.params.public_key
    );
    return res.send(account);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

accountDetailByEmail = async (req, res) => {
  try {
    const account = await accountsService.getAccountDetailByEmail(req);
    return res.send(account);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

module.exports = { accountDetailByPublicKey, accountDetailByEmail };
