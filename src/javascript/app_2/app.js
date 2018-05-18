import React                    from 'react';
import { render }               from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import NetworkMonitor           from './base/network_monitor';
import ClientStore              from './store/client_store';
import { MobxProvider }         from './store/connect';
import TradeStore               from './store/trade_store';
import UIStore                  from './store/ui_store';
import Footer                   from './components/layout/footer.jsx';
import Header                   from './components/layout/header.jsx';
import { initActions }          from './pages/trading/actions';
import { BinaryRoutes }         from './routes';
import Client                   from '../_common/base/client_base';
import { localize }             from '../_common/localize';

const stores = {
    client: new ClientStore(),
    trade : new TradeStore(),
    ui    : new UIStore(),
};

const initApp = () => {
    Client.init();
    NetworkMonitor.init(stores.client);

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
                    <Header
                        items={[
                            { icon: 'trade',     text: localize('Trade'),     link_to: '/' },
                            { icon: 'portfolio', text: localize('Portfolio') },
                            { icon: 'statement', text: localize('Statement'), link_to: 'statement' },
                            { icon: 'cashier',   text: localize('Cashier') },
                        ]}
                    />
                </div>
                <div id='app_contents'>
                    <BinaryRoutes />
                </div>
                <footer id='trading_footer'>
                    <Footer
                        items={[
                            { icon: 'ic-statement',   text: localize('Statement'), link_to: 'statement' },
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
