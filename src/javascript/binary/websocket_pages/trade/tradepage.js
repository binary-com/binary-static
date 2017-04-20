import TradingAnalysis from './analysis';
import commonTrading from './common';
import { chartFrameCleanup } from './charts/chart_frame';
import displayCurrencies from './currency';
import Defaults from './defaults';
import TradingEvents from './event';
import Price from './price';
import Process from './process';
import ViewPopup from '../user/view_popup/view_popup';
import BinaryPjax from '../../base/binary_pjax';
import { localize } from '../../base/localize';
import { State } from '../../base/storage';
import { jpClient } from '../../common_functions/country_base';
import Guide from '../../common_functions/guide';

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
