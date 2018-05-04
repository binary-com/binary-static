import 'babel-polyfill';
import 'promise-polyfill';

import initApp             from './app';
import NetworkMonitor      from './base/network_monitor';
import Client              from '../_common/base/client_base';
import { checkNewRelease } from '../_common/check_new_release';

window.check_new_release = checkNewRelease; // used by GTM to update page after a new release

const init = () => {
    Client.init();
    NetworkMonitor.init();
    initApp();
};

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('pageshow', (e) => { // Safari doesn't fire load event when using back button
    if (e.persisted) {
        init();
    }
});
