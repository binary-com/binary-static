// TODO: to be remove after webpack finalized
const exportAllFunctions = function(obj) {
    Object.keys(obj).forEach(function (key) {
        window[key] = obj[key];
    });
};

window.$ = window.jQuery = require('jquery');

require('babel-polyfill');
require('promise-polyfill');

// needs refactoring
exportAllFunctions(require('./binary/websocket_pages/socket'));

// created for handling global onclick
exportAllFunctions(require('./binary/common_functions/attach_dom/handle_click'));
// used by gtm to update page after a new release
exportAllFunctions(require('./binary/common_functions/check_new_release'));

require('event-source-polyfill');
require('./lib/jquery.sparkline.js');
require('jquery.scrollto');

require('./binary/components/trackjs_onerror');
require('./binary/static_pages/static_pjax');
require('./binary/websocket_pages/websocket_pjax');
