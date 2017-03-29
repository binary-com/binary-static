const TradingAnalysis      = require('./analysis').TradingAnalysis;
const addEventListenerForm = require('./common').addEventListenerForm;
const chartFrameCleanup    = require('./common').chartFrameCleanup;
const showFormOverlay      = require('./common').showFormOverlay;
const showPriceOverlay     = require('./common').showPriceOverlay;
const displayCurrencies    = require('./currency').displayCurrencies;
const Defaults             = require('./defaults').Defaults;
const TradingEvents        = require('./event').TradingEvents;
const Message              = require('./message').Message;
const Notifications        = require('./notifications').Notifications;
const Price                = require('./price').Price;
const forgetTradingStreams = require('./process').forgetTradingStreams;
const Symbols              = require('./symbols').Symbols;
const ViewPopupWS          = require('../user/view_popup/view_popupws');
const BinaryPjax           = require('../../base/binary_pjax');
const localize             = require('../../base/localize').localize;
const State                = require('../../base/storage').State;
const jpClient             = require('../../common_functions/country_base').jpClient;
const Guide                = require('../../common_functions/guide');

const TradePage = (function() {
    let events_initialized = 0;
    State.remove('is_trading');

    const onLoad = function() {
        if (jpClient()) {
            BinaryPjax.load('multi_barriers_trading');
            return;
        }
        State.set('is_trading', true);
        if (sessionStorage.getItem('currencies')) {
            displayCurrencies();
        }
        BinarySocket.init({
            onmessage: function(msg) {
                Message.process(msg);
            },
            onopen: function() {
                Notifications.hide('CONNECTION_ERROR');
            },
        });
        Price.clearFormId();
        if (events_initialized === 0) {
            events_initialized = 1;
            TradingEvents.init();
        }

        if (sessionStorage.getItem('currencies')) {
            displayCurrencies();
            Symbols.getSymbols(1);
        } else {
            BinarySocket.send({ payout_currencies: 1 });
        }

        if (document.getElementById('websocket_form')) {
            addEventListenerForm();
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

        ViewPopupWS.viewButtonOnClick('#contract_confirmation_container');
    };

    const reload = function() {
        sessionStorage.removeItem('underlying');
        window.location.reload();
    };

    const onUnload = function() {
        State.remove('is_trading');
        events_initialized = 0;
        forgetTradingStreams();
        BinarySocket.clear();
        Defaults.clear();
        chartFrameCleanup();
    };

    const onDisconnect = function() {
        showPriceOverlay();
        showFormOverlay();
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
