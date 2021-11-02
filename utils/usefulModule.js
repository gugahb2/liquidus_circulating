const BN = require('bn.js');
const axios = require('axios');
const { bscscanAPI, apiKey, rewardTokenAddress, decimals } = require('../config');

const makeBNumber = (amount, decimal) => {
    const str = amount.toString();
    const isDecimal = str.includes('.');
    const decimalNumber = isDecimal ? str.split('.')[1].length : 0;
    let amountInt = parseInt(str.split('.').join(''));
    let decimalb = 10 ** (decimal - decimalNumber);
    if (decimalNumber > decimal) {
        amountInt = amountInt / (10 ** (decimalNumber - decimal));
        decimalb = 1;
    }
    
    const decimals = new BN(decimalb.toString());
    const bn = new BN(new BN(amountInt).mul(decimals));
    return bn;
}

const parseBNumber = (amount, decimal) => {
    let decimalb = 10 ** decimal;
    const value = amount / decimalb;
    return value;
}

const queryUrl = (url, params) => {
    const paths = [];
    for (const key of Object.keys(params)) {
        const atomStr = params[key] ? `${key}=${params[key]}` : `${key}`;
        paths.push(atomStr);
    }
    return `${url}?${paths.join('&')}`;
}

const getTotalSupply = async (tokenAddress) => {
    try {
        const response = await axios.get(queryUrl(bscscanAPI, {
            module: 'stats',
            action: 'tokensupply',
            contractaddress: tokenAddress,
            apikey: apiKey
        }));
        const totalSupply = parseBNumber(response.data.result, decimals);
    
        return totalSupply;
    } catch (err) {
        return 0;
    }
}

const getBEP20TokenAccountBalanceByContractAddress = async (tokenAddress, farmAddress) => {
    try {
        const response = await axios.get(queryUrl(bscscanAPI, {
            contractaddress: tokenAddress,
            address: farmAddress,
            module: 'account',
            action: 'tokenbalance',
            tag: 'latest',
            apikey: apiKey
        }));
    
        const tokenBalance = parseBNumber(response.data.result, decimals);
        return tokenBalance;
    } catch (err) {
        return 0;
    }
}

const getBNBPrice = async () => {
    try {
        const response = await axios.get('https://api.pancakeswap.info/api/v2/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c');
        return response.data.data.price;
    } catch (err) {
        return 0;
    }
}

const getLIQPrice = async () => {
    try {
        const response = await axios.get('https://api.pancakeswap.info/api/v2/tokens/0xc7981767f644c7f8e483dabdc413e8a371b83079');
        return response.data.data.price;
    } catch (err) {
        return 0;
    }
}

module.exports = {
    makeBNumber,
    parseBNumber,
    queryUrl,
    getBNBPrice,
    getLIQPrice,
    getTotalSupply,
    getBEP20TokenAccountBalanceByContractAddress
}
