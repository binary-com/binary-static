import React from 'react';
import { render } from 'react-dom';
import TradeApp from './trade_app.jsx';
import TradeStore from './store/trade_store';
import { MobxProvider } from './store/connect';

const stores = {
    trade: new TradeStore(),
};

const Trade = (() => {
    const onLoad = () => {
        const app = document.getElementById('trade_app');
        if (app) {
            render(
                <MobxProvider store={stores}>
                    <TradeApp />
                </MobxProvider>
            , app);
        }
    };

    return {
        onLoad,
    };
})();

module.exports = Trade;
