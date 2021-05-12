const StellarSdk = require('stellar-sdk');
const Console = require('Console');
require('dotenv').config();

sendPayments = async (req) => {
  try {
    const server = new StellarSdk.Server(process.env.STELLAR_HORIZON_TESTNET);
    const sourceKeys = StellarSdk.Keypair.fromSecret(req.body.secret_key);
    const destinationId = req.body.destination;

    // Asset issuing Keys
    const issuingKeys = StellarSdk.Keypair.fromSecret(
      process.env.ISSUING_SECRET_KEY
    );
    Console.debug(issuingKeys);

    // Transaction will hold a built transaction we can resubmit if the result is unknown.
    let transaction;
    let returnValue = '';
    let assetType;
    let issuingPublic = '';
    let assetCode = '';

    if (!req.body.issuing_public) {
      issuingPublic = issuingKeys.publicKey();
    } else {
      issuingPublic = req.body.issuing_public;
    }
    Console.debug(issuingPublic);

    if (!req.body.asset_code) {
      assetCode = process.env.ASSET_CODE;
    } else {
      assetCode = req.body.asset_code;
    }
    Console.debug(assetCode);

    if (assetCode === 'Native') {
      assetType = StellarSdk.Asset.native();
    } else {
      assetType = new StellarSdk.Asset(assetCode, issuingPublic);
    }
    Console.debug(assetType);

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
        Console.debug('Start building the transacton');
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
              asset: assetType,
              amount: req.body.amount.toString(),
            })
          )
          // A memo allows you to add your own metadata to a transaction. It's
          // optional and does not affect how Stellar treats the transaction.
          .addMemo(StellarSdk.Memo.text(req.body.memo))
          // Wait a maximum of three minutes for the transaction
          .setTimeout(Number(process.env.PAYMENT_TIMEOUT))
          .build();
        Console.debug('Start Sign the transaction');
        // Sign the transaction to prove you are actually the person sending it.
        transaction.sign(sourceKeys);
        Console.debug('Start submit transaction');
        // And finally, send it off to Stellar!
        return server.submitTransaction(transaction);
      })
      .then((result) => {
        console.log('return value:', result);
        returnValue = result;
      });
    Console.success(
      `( PaymentsService.js ) - sendPayments return successfully `
    );
    return {
      success: true,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
        'Access-Control-Allow-Headers':
          'Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: returnValue,
    };
  } catch (e) {
    Console.error(e.message);
    return { success: false, error: e.message };
  }
};

module.exports = { sendPayments };
