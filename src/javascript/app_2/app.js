import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { MobxProvider } from './pages/trading/store/connect';
import TradeStore from './pages/trading/store/trade_store';
import UIStore from './pages/trading/store/ui_store';
import TradingHeader from './pages/trading/components/elements/header.jsx';
import TradingFooter from './pages/trading/components/elements/footer.jsx';
import { initActions } from './pages/trading/actions';
import BinaryRoutes from './routes';
import { localize } from '../_common/localize';

const stores = {
    trade: new TradeStore(),
    ui   : new UIStore(),
};

const initApp = () => {
    initActions(stores.trade);
    stores.trade.init();

    const app = document.getElementById('binary_app');
    if (app) {
        render(<BinaryApp />, app);
    }
};

// TODO
// const onUnload = () => {
//     stores.trade.dispose();
//     disposeActions();
// };

const BinaryApp = () => (
    <Router>
        <MobxProvider store={stores}>
            <div>
                <div id='trading_header'>
                    <TradingHeader
                        items={[
                            { icon: 'trade',     text: localize('Trade'),     link_to: '/trade' },
                            { icon: 'portfolio', text: localize('Portfolio'), link_to: '/portfolio' },
                            { icon: 'statement', text: localize('Statement'), link_to: '/statement' },
                            { icon: 'cashier',   text: localize('Cashier'),   link_to: '/cashier' },
                        ]}
                    />
                </div>
                <div id='app_contents'>
                    <BinaryRoutes />
                </div>
                <footer id='trading_footer'>
                    <TradingFooter
                        items={[
                            { icon: 'ic-statement',   text: localize('Statement') },
                            { icon: 'ic-chat-bubble', text: localize('Notification') },
                            { icon: 'ic-lock-open',   text: localize('Lock') },
                        ]}
                    />
                </footer>
            </div>
        </MobxProvider>
    </Router>
);

export default initApp;
