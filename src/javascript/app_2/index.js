import 'babel-polyfill';
import 'promise-polyfill';

import { checkNewRelease } from '_common/check_new_release';
import initApp             from './App/app';
import registerServiceWorker from './Utils/pwa';

window.check_new_release = checkNewRelease; // used by GTM to update page after a new release

registerServiceWorker();
initApp();

// TODO Remove the below comments
/**
 * The below lines are not necessary anymore since we are using `defer` in script tags.
 * It tells the browser to download the scripts without blocking the HTML parsing and
 * execute them after parsing is completely finished in the order they appear in the HTML.
 * Please let me know if you think we need to listen to this two events; otherwise, I will remove them totally in the next PR.
 */

// document.addEventListener('DOMContentLoaded', initApp);
// window.addEventListener('pageshow', (e) => { // Safari doesn't fire load event when using back button
//     if (e.persisted) {
//         initApp();
//     }
// });
