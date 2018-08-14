// import { configure }     from 'mobx';
import React                from 'react';
import { render }           from 'react-dom';
import App                  from './app.jsx';
import NetworkMonitor       from '../Services/network_monitor';
import RootStore            from '../Stores';
import { setStorageEvents } from '../Utils/Events/storage';
import Client               from '../../_common/base/client_base';

// configure({ enforceActions: true }); // disabled for SmartCharts compatibility

const initApp = () => {
    Client.init();

    setStorageEvents();

    const root_store = new RootStore();

    NetworkMonitor.init(root_store);

    root_store.modules.trade.init();

    const app = document.getElementById('binary_app');
    if (app) {
        render(<App root_store={root_store} />, app);
    }
};

export default initApp;
