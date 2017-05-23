const MBPrice   = require('../../websocket_pages/mb_trade/mb_price');

const HandleClick = (param, ...values) => {
    switch (param) {
        case 'MBPrice':
            return values && MBPrice.processBuy(values[0], values[1]);
        // no default
    }
    return () => null;
};

module.exports = {
    HandleClick: HandleClick,
};
