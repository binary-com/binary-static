import MBContract from './mb_contract';
import MBDisplayCurrencies from './mb_currency';
import MBTradingEvents from './mb_event';
import MBPrice from './mb_price';
import MBProcess from './mb_process';
import TradingAnalysis from '../trade/analysis';
import { chartFrameCleanup } from '../trade/charts/chart_frame';
import { localize } from '../../base/localize';
import { State } from '../../base/storage';
import JapanPortfolio from '../../../binary_japan/trade_japan/portfolio';

const MBTradePage = (() => {
    'use strict';

    let events_initialized = 0;
    State.remove('is_mb_trading');

    const onLoad = () => {
        State.set('is_mb_trading', true);

        if (events_initialized === 0) {
            events_initialized = 1;
            MBTradingEvents.init();
        }

        BinarySocket.send({ payout_currencies: 1 }).then(() => {
            MBDisplayCurrencies('', false);
            MBProcess.getSymbols();
        });

        TradingAnalysis.bindAnalysisTabEvent();
        $('#tab_portfolio').find('a').text(localize('Portfolio'));
        $('#tab_graph').find('a').text(localize('Chart'));
        $('#tab_explanation').find('a').text(localize('Explanation'));
        $('#remaining-time-label').text(localize('Remaining time'));
        window.chartAllowed = true;
        State.set('ViewPopup.onDisplayed', MBPrice.hidePriceOverlay);
    };

    const reload = () => {
        window.location.reload();
    };

    const onUnload = () => {
        chartFrameCleanup();
        window.chartAllowed = false;
        JapanPortfolio.hide();
        State.remove('is_mb_trading');
        events_initialized = 0;
        MBContract.onUnload();
        MBPrice.onUnload();
        MBProcess.onUnload();
        BinarySocket.clear();
        State.remove('ViewPopup.onDisplayed');
    };

    const onDisconnect = () => {
        MBPrice.showPriceOverlay();
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

module.exports = MBTradePage;
