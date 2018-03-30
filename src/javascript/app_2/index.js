import 'babel-polyfill';
import 'promise-polyfill';
import jquery from 'jquery';

import initApp             from './app';
import { checkNewRelease } from '../_common/check_new_release';
import Client              from '../app/base/client';
import NetworkMonitor      from '../app/base/network_monitor';

// TODO: remove all dependencies to app folder, jquery, ...

window.$ = window.jQuery = jquery;
window.check_new_release = checkNewRelease; // used by GTM to update page after a new release


const init = () => {
    Client.init();
    NetworkMonitor.init();
    initApp();
};

document.addEventListener('DOMContentLoaded', init);
$(window).on('pageshow', (e) => { // Safari doesn't fire load event when using back button
    if (e.originalEvent.persisted) {
        init();
    }
});
