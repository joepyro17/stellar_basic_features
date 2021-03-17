const Console = require('Console');
const paymentsService = require('../services/PaymentsService');

sendPayment = async (req, res) => {
  try {
    const result = await paymentsService.sendPayments(req);
    Console.success(`sendPayment return successfully`);
    return res.send(result);
  } catch (e) {
    Console.error(e.message());
    return res.status(500).send(e.message);
  }
};

module.exports = { sendPayment };
