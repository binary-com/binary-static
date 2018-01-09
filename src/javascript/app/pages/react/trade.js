import React from 'react';
import { render } from 'react-dom';
import TradeApp from './trade_app.jsx';

const Trade = (() => {
    const onLoad = () => {
        const app = document.getElementById('trade_app');
        if (app) {
            render(<TradeApp />, app);
        }
    };

    return {
        onLoad,
    };
})();

module.exports = Trade;
