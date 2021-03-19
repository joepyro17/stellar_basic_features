const StellarSdk = require('stellar-sdk');
const Console = require('Console');
require('dotenv').config();

createAsset = async (req) => {
  try {
    const server = new StellarSdk.Server(process.env.STELLAR_HORIZON_TESTNET);
    const issuingKeys = StellarSdk.Keypair.fromSecret(req.body.issuing_key);
    const receivingKeys = StellarSdk.Keypair.fromSecret(req.body.receiving_key);
    let returnValue = '';

    let assetCode = '';

    if (!req.body.asset_code) {
      assetCode = process.env.ASSET_CODE;
    } else {
      assetCode = req.body.asset_code;
    }
    // Create an object to represent the new asset
    const assetType = new StellarSdk.Asset(
      assetCode,
      issuingKeys.publicKey()
    );
    // First, the receiving account must trust the asset
    await server
      .loadAccount(receivingKeys.publicKey())
      .then((receiver) => {
        const transaction = new StellarSdk.TransactionBuilder(receiver, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET
        })
          // The changeTrust operation create a trust line
          // The limit parameter below is optional
          .addOperation(
            StellarSdk.Operation.changeTrust({
              asset: assetType,
              limit: process.env.ASSET_LIMIT
            })
          )
          .setTimeout(Number(process.env.TRANSACTION_TIMEOUT))
          .build();
        transaction.sign(receivingKeys);
        return server.submitTransaction(transaction);
      })
      .then(console.log)
      // Second, the issuing account actually sends a payment using the asset\
      .then(() => {
        return server.loadAccount(issuingKeys.publicKey());
      })
      .then((issuer) => {
        const transaction = new StellarSdk.TransactionBuilder(issuer, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET
        })
          .addOperation(
            StellarSdk.Operation.payment({
              destination: receivingKeys.publicKey(),
              asset: assetType,
              amount: req.body.receiving_amount.toString()
            })
          )
          .setTimeout(Number(process.env.TRANSACTION_TIMEOUT))
          .build();
        transaction.sign(issuingKeys);
        return server.submitTransaction(transaction);
      })
      .then(console.log)
      .then((result) => {
        console.log('return value:', result);
        returnValue = result;
      });
    Console.success(`( AssetsService.js ) - createAsset return successfully `);
    return { success: true, body: returnValue };
  } catch (e) {
    Console.error(e.message);
    return { success: false, error: e.message };
  }
};

// This will create a new token
// JOE:GCXGLHNZCCDWAPIRPRMBOECRNH3V3XQVQZ644JOQNA2SDW223MC4FRHM from Master Account to the new user
createAssetAfterSignUp = async (receivingSecretKey) => {
  Console.debug('createAssetAfterSignUp');
  Console.debug(receivingSecretKey);
  try {
    const server = new StellarSdk.Server(process.env.STELLAR_HORIZON_TESTNET);
    const issuingKeys = StellarSdk.Keypair.fromSecret(
      process.env.ISSUING_SECRET_KEY
    );
    const receivingKeys = StellarSdk.Keypair.fromSecret(receivingSecretKey);

    // Create an object to represent the new asset
    const assetType = new StellarSdk.Asset(
      process.env.ASSET_CODE,
      issuingKeys.publicKey()
    );
    // First, the receiving account must trust the asset
    await server
      .loadAccount(receivingKeys.publicKey())
      .then((receiver) => {
        const transaction = new StellarSdk.TransactionBuilder(receiver, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET
        })
          // The changeTrust operation create a trust line
          // The limit parameter below is optional
          .addOperation(
            StellarSdk.Operation.changeTrust({
              asset: assetType,
              limit: process.env.ASSET_LIMIT
            })
          )
          .setTimeout(Number(process.env.TRANSACTION_TIMEOUT))
          .build();
        transaction.sign(receivingKeys);
        return server.submitTransaction(transaction);
      })
      .then(console.log)
      // Second, the issuing account actually sends a payment using the asset\
      .then(() => {
        return server.loadAccount(issuingKeys.publicKey());
      })
      .then((issuer) => {
        const transaction = new StellarSdk.TransactionBuilder(issuer, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET
        })
          .addOperation(
            StellarSdk.Operation.payment({
              destination: receivingKeys.publicKey(),
              asset: assetType,
              amount: process.env.INITIAL_AMOUNT
            })
          )
          .setTimeout(Number(process.env.TRANSACTION_TIMEOUT))
          .build();
        transaction.sign(issuingKeys);
        return server.submitTransaction(transaction);
      })
      .then(console.log)
      .then((result) => {
        console.log('return value:', result);
      });
    Console.success(
      `( AssetsService.js ) - createAssetAfterSignUp return successfully `
    );
  } catch (e) {
    Console.error(e.message);
  }
};
module.exports = { createAsset, createAssetAfterSignUp };
