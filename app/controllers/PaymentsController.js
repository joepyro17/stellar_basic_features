const paymentsService = require('../services/PaymentsService');

sendPayment = async (req, res) => {
  try {
    const result = await paymentsService.sendPayments(req);
    return res.send(result);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

module.exports = { sendPayment };
