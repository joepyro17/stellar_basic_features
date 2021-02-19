const accountsService = require('../services/AccountsServices');

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

module.exports = { accountDetailByPublicKey };
