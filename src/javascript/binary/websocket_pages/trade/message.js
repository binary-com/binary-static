const DigitInfo     = require('./charts/digit_info');
const Notifications = require('./notifications');
const Process       = require('./process');
const Purchase      = require('./purchase');
const Tick          = require('./tick');
const GTM           = require('../../base/gtm');
const State         = require('../../base/storage').State;

/*
 * This Message object process the response from server and fire
 * events based on type of response
 */
const Message = (() => {
    'use strict';

    const process = (msg) => {
        const response = JSON.parse(msg.data);
        if (!State.get('is_trading')) {
            Process.forgetTradingStreams();
            return;
        }
        if (response) {
            const type = response.msg_type;
            if (type === 'active_symbols') {
                Process.processActiveSymbols(response);
            } else if (type === 'contracts_for') {
                Notifications.hide('CONNECTION_ERROR');
                Process.processContract(response);
                window.contracts_for = response;
            } else if (type === 'proposal') {
                Process.processProposal(response);
            } else if (type === 'buy') {
                Purchase.display(response);
                GTM.pushPurchaseData(response);
            } else if (type === 'tick') {
                Process.processTick(response);
            } else if (type === 'history') {
                if (response.req_id === 1 || response.req_id === 2) {
                    DigitInfo.showChart(response.echo_req.ticks_history, response.history.prices);
                } else                    {
                    Tick.processHistory(response);
                }
            } else if (type === 'trading_times') {
                Process.processTradingTimes(response);
            } else if (type === 'error') {
                $('.error-msg').text(response.error.message);
            }
        } else {
            console.log('some error occured');
        }
    };

    return {
        process: process,
    };
})();

module.exports = Message;
