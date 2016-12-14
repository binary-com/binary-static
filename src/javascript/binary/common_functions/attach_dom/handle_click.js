var CashierJP = require('../../../binary_japan/cashier').CashierJP;
var MBPrice   = require('../../websocket_pages/mb_trade/mb_price').MBPrice;

var HandleClick = function (param, ...values) {
    switch (param) {
        case 'CashierJP':
            return CashierJP.error_handler();
        case 'MBPrice':
            return values && MBPrice.processBuy(values[0], values[1]);
        // no default
    }
};

module.exports = {
    HandleClick: HandleClick,
};
