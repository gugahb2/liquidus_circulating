var express = require('express');
var router = express.Router();
const Web3 = require('web3');
const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
const axios = require('axios');
const { bscscanAPI, apiKey, rewardTokenAddress, farmContractList } = require('../config');
const { queryUrl, parseBNumber } = require('../utils/usefulModule');
const decimals = 18;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET circulate */
router.get('/circulate', async function(req, res, next) {
  const response = await axios.get(queryUrl(bscscanAPI, {
    module: 'stats',
    action: 'tokensupply',
    contractaddress: rewardTokenAddress,
    apikey: apiKey
  }));
  const totalSupply = parseBNumber(response.data.result, decimals);

  let holdedAmount = 0;

  for (const contract of farmContractList) {
    if (contract.type === 'LIQ_SINGLE') {
      const farmContract = new web3.eth.Contract(contract.abi, contract.address);
      const remainSupply = await farmContract.methods.rewardTokenSupplyRemaining().call();
      const rewardTokenSupply = parseBNumber(remainSupply, decimals);

      holdedAmount += rewardTokenSupply;
    } else {
      const response = await axios.get(queryUrl(bscscanAPI, {
        module: 'account',
        action: 'tokenbalance',
        contractaddress: rewardTokenAddress,
        address: contract.address,
        tag: 'latest',
        apikey: apiKey
      }));
      const tokenbalance = parseBNumber(response.data.result, decimals);
      
      holdedAmount += tokenbalance;
    }
  }

  const circulating = totalSupply - holdedAmount;
  res.send({result: circulating});
});

module.exports = router;
