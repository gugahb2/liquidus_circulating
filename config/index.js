const FarmContract_LIQ_BNB = require('./FarmContractForLIQ_BNB.json');
const FarmContract_LIQ_Single = require('./FarmContractForSingleToken.json');
const NFT_StakingContract = require('./NFT_HelmetStakingContract.json');

const farmContractList = [
    {
        address: '0x787fa31b4d75E45c1B83649510a588D580Eb4f57',
        abi: FarmContract_LIQ_BNB,
        vesting: null, // month
        type: 'LIQ_BNB'
    },
    {
        address: '0xb944b748A35B6dFFDd924bffD85910F968943a72',
        abi: FarmContract_LIQ_BNB,
        vesting: 1, // month
        type: 'LIQ_BNB'
    },
    {
        address: '0x7A0D4A0D88994E73a9eDCd79Ecad9097aCb1d937',
        abi: FarmContract_LIQ_BNB,
        vesting: 1, // month
        type: 'LIQ_BUSD'
    },
    {
        address: '0x19646186D7364b8c1Fb60f9772d2B186EA68983D',
        abi: FarmContract_LIQ_BNB,
        vesting: 3, // month
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
        address: '0xAb97B17B1547A8776299D4934fF5C8c7b247db6A',
        abi: FarmContract_LIQ_Single,
        vesting: 6, // month
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
    },
    {
        address: '0xd6499f34b7657f88B95c992D1C2Afc41fc0aAca6',
        abi: NFT_StakingContract,
        type: 'NFT_STAKING',
    },
    {
        address: '0x2a09470aF47becCfD97885835C8dC421550ea8A4',
        abi: NFT_StakingContract,
        type: 'NFT_STAKING',
    },
    {
        address: '0x31771217B3183BE23d4ec89A930A8F844614E054',
        abi: NFT_StakingContract,
        type: 'NFT_STAKING',
    }
];

const rewardTokenAddress = '0xc7981767f644c7f8e483dabdc413e8a371b83079';
const bscscanAPI = 'https://api.bscscan.com/api';
const apiKey = 'X8IAD5N2GYDFSHNZX69VWE9JMRW4SI5QRJ';
const decimals = 18;
const compoundingPeriod = 365;

module.exports = {
    farmContractList,
    bscscanAPI,
    apiKey,
    rewardTokenAddress,
    decimals,
    compoundingPeriod
};
