const FarmContract_LIQ_BNB = require('./FarmContractForLIQ_BNB.json');
const FarmContract_LIQ_Single = require('./FarmContractForSingleToken.json');

const farmContractList = [
    // {
    //     address: '0xd8D8D1B56e2E87a9C5e0A53A2039e5Ff1172D8A8',
    //     abi: FarmContract_LIQ_BNB,
    //     vesting: null,
    //     type: 'LIQ_BNB'
    // },
    {
        address: '0xb944b748A35B6dFFDd924bffD85910F968943a72',
        abi: FarmContract_LIQ_BNB,
        vesting: 1, // month
        type: 'LIQ_BNB'
    },
    {
        address: '0xbeBCd3aD501Fc425a71CDC7593CEDeA324176E92',
        abi: FarmContract_LIQ_Single,
        vesting: 1, // month
        type: 'LIQ_SINGLE',
    },
    {
        address: '0x5CcD597728b1F088bFB749D9a9798ED0C6e2211C',
        abi: FarmContract_LIQ_Single,
        vesting: 3, // month
        type: 'LIQ_SINGLE',
    },
    {
        address: '0xc6AEd0e5B81383Fd8537f4f805492732BDf8efC0',
        abi: FarmContract_LIQ_Single,
        vesting: 12, // month
        type: 'LIQ_SINGLE',
    },
    {
        address: '0xeaed594b5926a7d5fbbc61985390baaf936a6b8d',
        type: 'VESTED',
    },
    {
        address: '0xaf967c1a979d4600affce6bffbaeacfd165a1a2a',
        type: 'OWNED',
    }
];

const rewardTokenAddress = '0xc7981767f644c7f8e483dabdc413e8a371b83079';
const bscscanAPI = 'https://api.bscscan.com/api';
const apiKey = 'X8IAD5N2GYDFSHNZX69VWE9JMRW4SI5QRJ';

module.exports = { farmContractList, bscscanAPI, apiKey, rewardTokenAddress };
