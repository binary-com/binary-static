const TradingAnalysis   = require('./analysis');
const commonTrading     = require('./common');
const chartFrameCleanup = require('./charts/chart_frame').chartFrameCleanup;
const displayCurrencies = require('./currency');
const Defaults          = require('./defaults');
const TradingEvents     = require('./event');
const Price             = require('./price');
const Process           = require('./process');
const BinarySocket      = require('../socket');
const ViewPopup         = require('../user/view_popup/view_popup');
const BinaryPjax        = require('../../base/binary_pjax');
const localize          = require('../../base/localize').localize;
const State             = require('../../base/storage').State;
const jpClient          = require('../../common_functions/country_base').jpClient;
const Guide             = require('../../common_functions/guide');

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
        Price.clearFormId();
        if (events_initialized === 0) {
            events_initialized = 1;
            TradingEvents.init();
        }

        BinarySocket.send({ payout_currencies: 1 }).then(() => {
            displayCurrencies();
            Process.processActiveSymbols();
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
        Process.forgetTradingStreams();
        BinarySocket.clear();
        Defaults.clear();
        chartFrameCleanup();
        commonTrading.clean();
        BinarySocket.clear('active_symbols');
    };

    const onDisconnect = () => {
        commonTrading.showPriceOverlay();
        commonTrading.showFormOverlay();
        chartFrameCleanup();
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
