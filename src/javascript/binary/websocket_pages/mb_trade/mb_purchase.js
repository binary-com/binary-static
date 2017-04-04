const MBNotifications = require('./mb_notifications');
const MBPrice         = require('./mb_price');
const ViewPopup       = require('../user/view_popup/view_popup');

/*
 * Purchase object that handles all the functions related to
 * contract purchase response
 */

const MBPurchase = (() => {
    'use strict';

    const display = (response) => {
        if (response.error) {
            MBPrice.hidePriceOverlay();
            MBNotifications.show({ text: response.error.message, uid: 'BUY_ERROR', dismissible: true });
        } else {
            MBNotifications.hide('BUY_ERROR');
            ViewPopup.init($('<div />', { contract_id: response.buy.contract_id }).get(0));
        }
    };

    return {
        display: display,
    };
})();

module.exports = MBPurchase;
