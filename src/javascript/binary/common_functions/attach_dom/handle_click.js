const CashierJP = require('../../../binary_japan/cashier');

const HandleClick = (param) => {
    switch (param) {
        case 'CashierJP':
            return CashierJP.errorHandler();
        // no default
    }
    return () => null;
};

module.exports = {
    HandleClick,
};
