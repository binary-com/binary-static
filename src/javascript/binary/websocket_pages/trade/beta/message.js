const DigitInfo_Beta = require('./charts/digit_info');
const Process_Beta   = require('./process');
const Purchase_Beta  = require('./purchase');
const Notifications  = require('../notifications');
const GetTicks       = require('../get_ticks');
const AssetIndexUI   = require('../../resources/asset_index/asset_index.ui');
const TradingTimesUI = require('../../resources/trading_times/trading_times.ui');
const GTM            = require('../../../base/gtm');
const State          = require('../../../base/storage').State;

/*
 * This Message object process the response from server and fire
 * events based on type of response
 */
const Message_Beta = (() => {
    'use strict';

    const process = (msg) => {
        const response = JSON.parse(msg.data);
        if (!State.get('is_beta_trading')) {
            Process_Beta.forgetTradingStreams_Beta();
            return;
        }
        if (response) {
            const type = response.msg_type;
            if (type === 'contracts_for') {
                Notifications.hide('CONNECTION_ERROR');
                Process_Beta.processContract_Beta(response);
                window.contracts_for = response;
            } else if (type === 'proposal') {
                Process_Beta.processProposal_Beta(response);
            } else if (type === 'buy') {
                Purchase_Beta.display(response);
                GTM.pushPurchaseData(response);
            } else if (type === 'tick') {
                Process_Beta.processTick_Beta(response);
            } else if (type === 'history') {
                if (response.req_id === 1 || response.req_id === 2) {
                    DigitInfo_Beta.showChart(response.echo_req.ticks_history, response.history.prices);
                } else {
                    GetTicks.processHistory(response);
                }
            } else if (type === 'asset_index') {
                AssetIndexUI.setAssetIndex(response);
            } else if (type === 'trading_times') {
                Process_Beta.processTradingTimes_Beta(response);
                TradingTimesUI.setTradingTimes(response);
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

module.exports = Message_Beta;
