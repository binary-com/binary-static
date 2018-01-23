import React from 'react';
import { render } from 'react-dom';
import { MobxProvider } from './store/connect';
import TradeStore from './store/trade_store';
import TradeApp from './trade_app.jsx';
import { State } from '../../../_common/storage';

const stores = {
    trade: new TradeStore(),
};

const Trading = (() => {
    const onLoad = () => {
        State.set('is_trading_2', true);

        const app = document.getElementById('trade_app');
        if (app) {
            render(
                <MobxProvider store={stores}>
                    <TradeApp />
                </MobxProvider>
                , app);
        }
    };

    const onUnload = () => {
        State.remove('is_trading_2');
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = Trading;
