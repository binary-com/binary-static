const MBPrice   = require('../../websocket_pages/mb_trade/mb_price').MBPrice;
const CashierJP = require('../../../binary_japan/cashier');

const HandleClick = (param, ...values) => {
    switch (param) {
        case 'CashierJP':
            return CashierJP.errorHandler();
        case 'MBPrice':
            return values && MBPrice.processBuy(values[0], values[1]);
        // no default
    }
    return () => null;
};

module.exports = {
    HandleClick: HandleClick,
};
