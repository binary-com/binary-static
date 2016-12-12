var CashierJP = require('../../../binary_japan/cashier').CashierJP;

var HandleClick = function (param) {
    switch (param) {
        case 'CashierJP':
            return CashierJP.error_handler();
        // no default
    }
};

module.exports = {
    HandleClick: HandleClick,
};
