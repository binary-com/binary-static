import 'babel-polyfill';
import 'promise-polyfill';

import initApp             from './App/app';
import { checkNewRelease } from '../_common/check_new_release';

window.check_new_release = checkNewRelease; // used by GTM to update page after a new release

// console.log(window.localStorage.is_app_ready);
// window.addEventListener('storage.app_status', (e) => {
//     console.log(e.key);
//     if (e.key === 'is_app_ready' && e.newValue === true) {
//         console.log('hello');
//     }
// });
// window.dispatchEvent( new Event('storage') );

initApp();
// document.addEventListener('load', initApp);
// window.addEventListener('pageshow', (e) => { // Safari doesn't fire load event when using back button
//     if (e.persisted) {
//         initApp();
//     }
// });
