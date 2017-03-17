const MBContract          = require('./mb_contract').MBContract;
const MBDisplayCurrencies = require('./mb_currency').MBDisplayCurrencies;
const MBNotifications     = require('./mb_notifications').MBNotifications;
const MBProcess           = require('./mb_process').MBProcess;
const MBPurchase          = require('./mb_purchase').MBPurchase;
const MBSymbols           = require('./mb_symbols').MBSymbols;
const MBTick              = require('./mb_tick').MBTick;
const PortfolioWS = require('../user/account/portfolio/portfolio.init');
const State  = require('../../base/storage').State;
const GTM    = require('../../base/gtm').GTM;
const Client = require('../../base/client').Client;
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
            } else if (type === 'payout_currencies' && response.hasOwnProperty('echo_req') && (!response.echo_req.hasOwnProperty('passthrough') || !response.echo_req.passthrough.hasOwnProperty('handler'))) {
                Client.set('currencies', response.payout_currencies.join(','));
                MBDisplayCurrencies('', false);
                MBSymbols.getSymbols(1);
            } else if (type === 'proposal_array') {
                MBProcess.processProposal(response);
            } else if (type === 'buy') {
                MBPurchase.display(response);
                GTM.push_purchase_data(response);
            } else if (type === 'tick') {
                MBProcess.processTick(response);
            } else if (type === 'history') {
                MBTick.processHistory(response);
            } else if (type === 'trading_times') {
                processTradingTimes(response);
            } else if (type === 'portfolio') {
                PortfolioWS.updatePortfolio(response);
            } else if (type === 'proposal_open_contract') {
                PortfolioWS.updateIndicative(response);
            } else if (type === 'transaction') {
                PortfolioWS.transactionResponseHandler(response);
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
