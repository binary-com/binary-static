const TradingAnalysis_Beta = require('./analysis');
const TradingEvents_Beta   = require('./event');
const Price_Beta           = require('./price');
const Process_Beta         = require('./process');
const commonTrading        = require('../common');
const cleanupChart         = require('../charts/webtrader_chart').cleanupChart;
const displayCurrencies    = require('../currency');
const Defaults             = require('../defaults');
const BinarySocket         = require('../../socket');
const PortfolioInit        = require('../../user/account/portfolio/portfolio.init');
const ViewPopup            = require('../../user/view_popup/view_popup');
const BinaryPjax           = require('../../../base/binary_pjax');
const State                = require('../../../base/storage').State;
const jpClient             = require('../../../common_functions/country_base').jpClient;
const Guide                = require('../../../common_functions/guide');

const TradePage_Beta = (() => {
    let events_initialized = 0;
    State.remove('is_beta_trading');

    const onLoad = () => {
        if (jpClient()) {
            BinaryPjax.load('multi_barriers_trading');
            return;
        }
        State.set('is_beta_trading', true);
        $('.container').css('max-width', '1200px');
        Price_Beta.clearFormId();
        if (events_initialized === 0) {
            events_initialized = 1;
            TradingEvents_Beta.init();
        }

        BinarySocket.wait('authorize').then(() => {
            BinarySocket.send({ payout_currencies: 1 }).then(() => {
                displayCurrencies();
                Process_Beta.processActiveSymbols_Beta();
            });
        });

        if (document.getElementById('websocket_form')) {
            commonTrading.addEventListenerForm();
        }

        // Walktrough Guide
        Guide.init({
            script: 'trading',
        });
        TradingAnalysis_Beta.bindAnalysisTabEvent();

        ViewPopup.viewButtonOnClick('#contract_confirmation_container');
    };

    const reload = () => {
        sessionStorage.removeItem('underlying');
        window.location.reload();
    };

    const onUnload = () => {
        State.remove('is_beta_trading');
        events_initialized = 0;
        Process_Beta.forgetTradingStreams_Beta();
        BinarySocket.clear();
        Defaults.clear();
        PortfolioInit.onUnload();
        cleanupChart();
        commonTrading.clean();
        BinarySocket.clear('active_symbols');
        $('.container').css('max-width', '');
    };

    const onDisconnect = () => {
        commonTrading.showPriceOverlay();
        commonTrading.showFormOverlay();
        cleanupChart();
        onLoad();
    };

    return {
        onLoad,
        reload,
        onUnload,
        onDisconnect,
    };
})();

module.exports = TradePage_Beta;
