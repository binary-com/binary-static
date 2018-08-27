import 'babel-polyfill';
import 'promise-polyfill';

import initApp             from './App/app';
import { checkNewRelease } from '../_common/check_new_release';

window.check_new_release = checkNewRelease; // used by GTM to update page after a new release

document.addEventListener('DOMContentLoaded', initApp);
window.addEventListener('pageshow', (e) => { // Safari doesn't fire load event when using back button
    if (e.persisted) {
        initApp();
    }
});
