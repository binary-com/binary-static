const TradingAnalysis      = require('./analysis');
const commonTrading        = require('./common');
const displayCurrencies    = require('./currency');
const Defaults             = require('./defaults');
const TradingEvents        = require('./event');
const Message              = require('./message');
const Notifications        = require('./notifications');
const Price                = require('./price');
const forgetTradingStreams = require('./process').forgetTradingStreams;
const Symbols              = require('./symbols');
const ViewPopup            = require('../user/view_popup/view_popup');
const BinaryPjax           = require('../../base/binary_pjax');
const localize             = require('../../base/localize').localize;
const State                = require('../../base/storage').State;
const jpClient             = require('../../common_functions/country_base').jpClient;
const Guide                = require('../../common_functions/guide');

const TradePage = (() => {
    'use strict';

    let events_initialized = 0;
    State.remove('is_trading');

    const onLoad = () => {
        if (jpClient()) {
            BinaryPjax.load('multi_barriers_trading');
            return;
        }
        State.set('is_trading', true);
        BinarySocket.init({
            onmessage: (msg) => {
                Message.process(msg);
            },
            onopen: () => {
                Notifications.hide('CONNECTION_ERROR');
            },
        });
        Price.clearFormId();
        if (events_initialized === 0) {
            events_initialized = 1;
            TradingEvents.init();
        }

        BinarySocket.send({ payout_currencies: 1 }).then(() => {
            displayCurrencies();
            Symbols.getSymbols(1);
        });

        if (document.getElementById('websocket_form')) {
            commonTrading.addEventListenerForm();
        }

        // Walk-through Guide
        Guide.init({
            script: 'trading',
        });
        TradingAnalysis.bindAnalysisTabEvent();
        $('#tab_portfolio').find('a').text(localize('Portfolio'));
        $('#tab_graph').find('a').text(localize('Chart'));
        $('#tab_explanation').find('a').text(localize('Explanation'));
        $('#tab_last_digit').find('a').text(localize('Last Digit Stats'));

        ViewPopup.viewButtonOnClick('#contract_confirmation_container');
    };

    const reload = () => {
        sessionStorage.removeItem('underlying');
        window.location.reload();
    };

    const onUnload = () => {
        State.remove('is_trading');
        events_initialized = 0;
        forgetTradingStreams();
        BinarySocket.clear();
        Defaults.clear();
        commonTrading.chartFrameCleanup();
    };

    const onDisconnect = () => {
        commonTrading.showPriceOverlay();
        commonTrading.showFormOverlay();
        commonTrading.chartFrameCleanup();
        onLoad();
    };

    return {
        onLoad      : onLoad,
        reload      : reload,
        onUnload    : onUnload,
        onDisconnect: onDisconnect,
    };
})();

module.exports = TradePage;
