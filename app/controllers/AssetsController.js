const Console = require('Console');
const assetsService = require('../services/AssetsService');

createAsset = async (req, res) => {
  try {
    const result = await assetsService.createAsset(req);
    Console.success(`createAsset return successfully`);
    return res.send(result);
  } catch (e) {
    Console.error(e.message);
    return res.status(500).send(e.message);
  }
};

module.exports = { createAsset };
