import { configure }        from 'mobx';
import React                from 'react';
import { render }           from 'react-dom';
import NetworkMonitor       from 'Services/network_monitor';
import root_store            from 'Stores';
import { setStorageEvents } from 'Utils/Events/storage';
import App                  from './app.jsx';

configure({ enforceActions: true });

const initApp = () => {
    setStorageEvents();

    NetworkMonitor.init(root_store);

    root_store.modules.trade.init();

    const app = document.getElementById('binary_app');
    if (app) {
        render(<App root_store={root_store} />, app);
    }
};

export default initApp;
