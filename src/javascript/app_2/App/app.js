import { configure }        from 'mobx';
import React                from 'react';
import { render }           from 'react-dom';
import AppComponent         from 'App/AppComponent';
import Client               from '_common/base/client_base';
import NetworkMonitor       from 'Services/network_monitor';
import RootStore            from 'Stores';
import { setStorageEvents } from 'Utils/Events/storage';

configure({ enforceActions: true });

const initApp = () => {
    Client.init();

    setStorageEvents();

    const root_store = new RootStore();

    NetworkMonitor.init(root_store);

    root_store.modules.trade.init();

    const app = document.getElementById('binary_app');
    if (app) {
        render(<AppComponent root_store={root_store} />, app);
    }
};

export default initApp;
