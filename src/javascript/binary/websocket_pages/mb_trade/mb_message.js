const MBContract      = require('./mb_contract');
const MBNotifications = require('./mb_notifications');
const MBProcess       = require('./mb_process');
const MBPurchase      = require('./mb_purchase');
const MBTick          = require('./mb_tick');
const Process         = require('../trade/process');
const GTM             = require('../../base/gtm');
const State           = require('../../base/storage').State;

/*
 * This Message object process the response from server and fire
 * events based on type of response
 */
const MBMessage = (() => {
    'use strict';

    const process = (msg) => {
        const response = JSON.parse(msg.data);
        if (!State.get('is_mb_trading')) {
            MBProcess.forgetTradingStreams();
            return;
        }
        if (response) {
            const type = response.msg_type;
            if (type === 'active_symbols') {
                MBProcess.processActiveSymbols(response);
            } else if (type === 'contracts_for') {
                MBNotifications.hide('CONNECTION_ERROR');
                MBContract.setContractsResponse(response);
                MBProcess.processContract(response);
            } else if (type === 'proposal_array') {
                MBProcess.processProposal(response);
            } else if (type === 'buy') {
                MBPurchase.display(response);
                GTM.pushPurchaseData(response);
            } else if (type === 'tick') {
                MBProcess.processTick(response);
            } else if (type === 'history') {
                MBTick.processHistory(response);
            } else if (type === 'trading_times') {
                Process.processTradingTimes(response);
            }
        }
    };

    return {
        process: process,
    };
})();

module.exports = MBMessage;
