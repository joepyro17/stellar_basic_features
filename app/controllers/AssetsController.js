const assetsService = require('../services/AssetsService');

createAsset = async (req, res) => {
  try {
    const result = await assetsService.createAsset(req);
    return res.send(result);
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

module.exports = { createAsset };
