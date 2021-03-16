const StellarSdk = require('stellar-sdk');
require('dotenv').config();

sendPayments = async (req) => {
  try {
    const server = new StellarSdk.Server(process.env.STELLAR_HORIZON_TESTNET);
    const sourceKeys = StellarSdk.Keypair.fromSecret(req.body.secret_key);
    const destinationId = req.body.destination;
    // Transaction will hold a built transaction we can resubmit if the result is unknown.
    let transaction;
    let returnValue = '';

    // First, check to make sure that the destination account exists.
    // You could skip this, but if the account does not exist, you will be charged
    // the transaction fee when the transaction fails.
    await server
      .loadAccount(destinationId)
      // If the account is not found, surface a nicer error message for logging.
      .catch((error) => {
        if (error instanceof StellarSdk.NotFoundError) {
          throw new Error('The destination account does not exist!');
        } else return error;
      })
      // If there was no error, load up-to-date information on your account.
      .then(() => {
        return server.loadAccount(sourceKeys.publicKey());
      })
      .then((sourceAccount) => {
        // Start building the transaction.
        transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            StellarSdk.Operation.payment({
              destination: destinationId,
              // Because Stellar allows transaction in many currencies, you must
              // specify the asset type. The special "native" asset represents Lumen.
              asset: StellarSdk.Asset.native(),
              amount: req.body.amount.toString(),
            })
          )
          // A memo allows you to add your own metadata to a transaction. It's
          // optional and does not affect how Stellar treats the transaction.
          .addMemo(StellarSdk.Memo.text(req.body.memo))
          // Wait a maximum of three minutes for the transaction
          .setTimeout(Number(process.env.PAYMENT_TIMEOUT))
          .build();
        // Sign the transaction to prove you are actually the person sending it.
        transaction.sign(sourceKeys);
        // And finally, send it off to Stellar!
        return server.submitTransaction(transaction);
      })
      .then((result) => {
        console.log('return value:', result);
        returnValue = result;
      });
    return { success: true, body: returnValue };
  } catch (e) {
    console.log(e);
    return { success: false, error: e.message };
  }
};

module.exports = { sendPayments };
