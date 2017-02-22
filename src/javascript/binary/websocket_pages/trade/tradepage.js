const TradingAnalysis      = require('./analysis').TradingAnalysis;
const displayCurrencies    = require('./currency').displayCurrencies;
const Defaults             = require('./defaults').Defaults;
const TradingEvents        = require('./event').TradingEvents;
const Message              = require('./message').Message;
const Notifications        = require('./notifications').Notifications;
const Price                = require('./price').Price;
const Symbols              = require('./symbols').Symbols;
const forgetTradingStreams = require('./process').forgetTradingStreams;
const Content              = require('../../common_functions/content').Content;
const Guide                = require('../../common_functions/guide').Guide;
const japanese_client      = require('../../common_functions/country_base').japanese_client;
const State                = require('../../base/storage').State;
const showPriceOverlay     = require('./common').showPriceOverlay;
const showFormOverlay      = require('./common').showFormOverlay;
const addEventListenerForm = require('./common').addEventListenerForm;
const chartFrameCleanup    = require('./common').chartFrameCleanup;
const ViewPopupWS          = require('../user/view_popup/view_popupws');
const localize = require('../../base/localize').localize;
const url_for  = require('../../base/url').url_for;

const TradePage = (function() {
    let events_initialized = 0;
    State.remove('is_trading');

    const onLoad = function() {
        if (japanese_client() && /\/trading\.html/i.test(window.location.pathname)) {
            window.location.href = url_for('multi_barriers_trading');
            return;
        } else if (!japanese_client() && /\/multi_barriers_trading\.html/.test(window.location.pathname)) {
            window.location.href = url_for('trading');
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
        Content.populate();

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
