var CashierJP = require('../../../binary_japan/cashier').CashierJP;

var HandleClick = function (param) {
    switch (param) {
        case 'CashierJP':
            return CashierJP.error_handler();
        // no default
    }
    return null;
};

module.exports = {
    HandleClick: HandleClick,
};
