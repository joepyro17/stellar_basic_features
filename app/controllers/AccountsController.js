const Console = require('Console');
const accountsService = require('../services/AccountsService');

accountDetailByPublicKey = async (req, res) => {
  try {
    const account = await accountsService.getAccountDetailByPublicKey(req);
    Console.success(`accountDetailByPublicKey return successfully`);
    return res.send(account);
  } catch (e) {
    Console.error(e.message);
    return res.status(500).send(e.message);
  }
};

accountDetailByEmail = async (req, res) => {
  try {
    const account = await accountsService.getAccountDetailByEmail(req);
    Console.success(`accountDetailByEmail return successfully`);
    return res.send(account);
  } catch (e) {
    Console.error(e.message);
    return res.status(500).send(e.message);
  }
};

transactionHistory = async (req, res) => {
  try {
    const transaction = await accountsService.getTransactionHistory(req);
    Console.success(`transactionHistory return successfully`);
    return res.send(transaction);
  } catch (e) {
    Console.error(e.message);
    return res.status(500).send(e.message);
  }
}

module.exports = { accountDetailByPublicKey, accountDetailByEmail, transactionHistory };
