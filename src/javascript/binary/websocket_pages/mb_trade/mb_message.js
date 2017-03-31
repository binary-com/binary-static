const MBContract           = require('./mb_contract').MBContract;
const MBNotifications      = require('./mb_notifications').MBNotifications;
const MBProcess            = require('./mb_process').MBProcess;
const MBPurchase           = require('./mb_purchase').MBPurchase;
const PortfolioInit        = require('../user/account/portfolio/portfolio.init');
const GTM                  = require('../../base/gtm');
const State                = require('../../base/storage').State;
const forgetTradingStreams = require('../trade/process').forgetTradingStreams;
const processTradingTimes  = require('../trade/process').processTradingTimes;

/*
 * This Message object process the response from server and fire
 * events based on type of response
 */
const MBMessage = (function () {
    'use strict';

    const process = function (msg) {
        const response = JSON.parse(msg.data);
        if (!State.get('is_mb_trading')) {
            forgetTradingStreams();
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
            } else if (type === 'proposal') {
                MBProcess.processProposal(response);
            } else if (type === 'buy') {
                MBPurchase.display(response);
                GTM.pushPurchaseData(response);
            } else if (type === 'trading_times') {
                processTradingTimes(response);
            } else if (type === 'portfolio') {
                PortfolioInit.updatePortfolio(response);
            } else if (type === 'proposal_open_contract') {
                PortfolioInit.updateIndicative(response);
            } else if (type === 'transaction') {
                PortfolioInit.transactionResponseHandler(response);
            }
        }
    };

    return {
        process: process,
    };
})();

module.exports = {
    MBMessage: MBMessage,
};
