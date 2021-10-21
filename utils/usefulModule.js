const BN = require('bn.js');


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

module.exports = {
    makeBNumber,
    parseBNumber,
    queryUrl
}
