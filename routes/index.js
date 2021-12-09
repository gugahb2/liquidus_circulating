var express = require('express');
var router = express.Router();
const Web3 = require('web3');
const web3 = new Web3('https://bsc-dataseed.binance.org:443');
// const FarmContractABI_LIQ_BNB = require('../config/FarmContractForLIQ_BNB.json');
// const FarmContractABI_LIQ_Single = require('../config/FarmContractForSingleToken.json');
const LPTokenABI = require('../config/LPTokenABI.json');
const { compoundingPeriod, rewardTokenAddress, farmContractList, decimals } = require('../config');
const {
  queryUrl,
  parseBNumber,
  getTotalSupply,
  getBNBPrice,
  getLIQPrice,
  getBEP20TokenAccountBalanceByContractAddress
} = require('../utils/usefulModule');
const maxRateLimit = 4;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET total supply */
router.get('/total', async function(req, res, next) {
  const totalSupply = await getTotalSupply(rewardTokenAddress);
  res.send(totalSupply.toString());
});

function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

/* GET circulate */
router.get('/circulate', async function(req, res, next) {
  if (!web3) return res.send('No provided web3');

  const totalSupply = await getTotalSupply(rewardTokenAddress);
  let holdedAmount = 0;

  for (const contract of farmContractList) {
    if (contract.type === 'LIQ_SINGLE') {
      const farmContract = new web3.eth.Contract(contract.abi, contract.address);
      const remainSupply = await farmContract.methods.rewardTokenSupplyRemaining().call();
      const rewardTokenSupply = parseBNumber(remainSupply, decimals);
      holdedAmount += rewardTokenSupply;
    } else {
      const tokenContract = new web3.eth.Contract(LPTokenABI, rewardTokenAddress);
      const balance = await tokenContract.methods.balanceOf(contract.address).call();
      const tokenbalance = parseBNumber(balance, decimals);
      holdedAmount += tokenbalance;
    }
  }

  const circulating = totalSupply - holdedAmount;
  res.send(circulating.toString());
});

/* GET total locked*/
router.get('/total-locked', async function(req, res, next) {
  if (!web3) return res.send('No provided web3');

  const bnbPrice = await getBNBPrice();
  const liqPrice = await getLIQPrice();

  let totalLiquidity = 0;

  for (const contract of farmContractList) {
    if (contract.type === 'VESTED' || contract.type === 'OWNED' || contract.type === 'NFT_STAKING') continue;

    const farmContract = new web3.eth.Contract(contract.abi, contract.address);

    if (contract.type === 'LIQ_BNB' || contract.type === 'LIQ_BUSD') {
      const lpToken = await farmContract.methods.lpToken().call();
      const tokenContract = new web3.eth.Contract(LPTokenABI, lpToken);
      const balance = await tokenContract.methods.balanceOf(contract.address).call();
      const cakeLp = parseBNumber(balance, decimals);
      const total = await tokenContract.methods.totalSupply().call(); // total LP
      const totalSupply = parseBNumber(total, decimals);

      const reserves = await tokenContract.methods.getReserves().call();

      let oneLP = 0;
      if (contract.type === 'LIQ_BNB') {
        const wbnb = parseBNumber(reserves._reserve0, decimals); // total BNB
        oneLP = totalSupply > 0 ? wbnb * 2 * bnbPrice / totalSupply : 0; // one LP price
      } else if (contract.type === 'LIQ_BUSD') {
        const busd = parseBNumber(reserves._reserve1, decimals); // total BUSD
        oneLP = totalSupply > 0 ? busd * 2 / totalSupply : 0; // one LP price
      }

      const cakeLpPrice = cakeLp * oneLP;
      totalLiquidity += cakeLpPrice;
      
    } else if (contract.type === 'LIQ_SINGLE') {
      
      const response = await farmContract.methods.stakedTokenSupply().call();
      const totalLIQ = parseBNumber(response, decimals);
      const liquidity = totalLIQ * liqPrice;
      totalLiquidity += liquidity;
    }
  }

  return res.send(totalLiquidity.toString());
});

/* GET max apy */
router.get('/max-apy', async function(req, res, next) {
  if (!web3) return res.send('No provided web3');

  const bnbPrice = await getBNBPrice();
  const liqPrice = await getLIQPrice();


  let maxAPY = 0;

  for (const contract of farmContractList) {
    if (contract.type === 'VESTED' || contract.type === 'OWNED' || contract.type === 'NFT_STAKING') continue;

    const farmContract = new web3.eth.Contract(contract.abi, contract.address);
    const rewardCnt = await farmContract.methods.rewardPerBlock().call();
    const rewardPerBlock = parseBNumber(rewardCnt, decimals);

    if (contract.type === 'LIQ_BNB' || contract.type === 'LIQ_BUSD') {
      const lpToken = await farmContract.methods.lpToken().call();
      const tokenContract = new web3.eth.Contract(LPTokenABI, lpToken);
      // const cakeLp = await getBEP20TokenAccountBalanceByContractAddress(lpToken, contract.address); // LP staked
      // const totalSupply = await getTotalSupply(lpToken);
      const balance = await tokenContract.methods.balanceOf(contract.address).call();
      const cakeLp = parseBNumber(balance, decimals);
      const total = await tokenContract.methods.totalSupply().call(); // total LP
      const totalSupply = parseBNumber(total, decimals);

      const reserves = await tokenContract.methods.getReserves().call();
      let oneLP = 0;
      if (contract.type === 'LIQ_BNB') {
        const wbnb = parseBNumber(reserves._reserve0, decimals); // total BNB
        oneLP = totalSupply > 0 ? wbnb * 2 * bnbPrice / totalSupply : 0; // one LP price
      } else if (contract.type === 'LIQ_BUSD') {
        const busd = parseBNumber(reserves._reserve1, decimals); // total BUSD
        oneLP = totalSupply > 0 ? busd * 2 / totalSupply : 0; // one LP price
      }
      const cakeLpPrice = cakeLp * oneLP;
      
      const rewardPerYear = (365 * 24 * 3600 / 3) * rewardPerBlock * liqPrice;
      const anualPercentReward = cakeLpPrice > 0 ? (rewardPerYear / cakeLpPrice) * 100 : 0;
      
      const anualPercentYield = (1 + (anualPercentReward / 100) / compoundingPeriod) ** compoundingPeriod - 1;
      if (anualPercentYield > maxAPY) maxAPY = anualPercentYield;

    } else if (contract.type === 'LIQ_SINGLE') {
      
      const response = await farmContract.methods.stakedTokenSupply().call();
      const totalLIQ = parseBNumber(response, decimals);
     
      const rewardPerYear = (365 * 24 * 3600 / 3) * rewardPerBlock;
      const anualPercentReward = totalLIQ > 0 ? (rewardPerYear / totalLIQ) * 100 : 0;
      const anualPercentYield = (1 + (anualPercentReward / 100) / compoundingPeriod) ** compoundingPeriod - 1;
      if (anualPercentYield > maxAPY) maxAPY = anualPercentYield;
    }
  }

  return res.send((maxAPY * 100).toString());
});

module.exports = router;
