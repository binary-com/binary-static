// TODO: to be remove after webpack finalized
var exportAllFunctions = function(obj) {
    Object.keys(obj).forEach(function (key) {
        window[key] = obj[key];
    });
};

window.$ = window.jQuery = require('jquery');

require('babel-polyfill');

// needs refactoring
exportAllFunctions(require('./binary/base/page'));
exportAllFunctions(require('./binary/websocket_pages/socket'));

// created for handling global onclick
exportAllFunctions(require('./binary/common_functions/attach_dom/handle_click'));

require('./lib/jquery-ui-timepicker/jquery.ui.timepicker.js');
require('event-source-polyfill');
require('./lib/jquery-ui.js');
require('./lib/jquery.sparkline.js');
require('jquery.scrollto');

require('./binary/components/trackjs_onerror');
require('./binary/static_pages/static_pjax');
require('./binary/websocket_pages/websocket_pjax');

// adding onClick function in javascript, find a work around
exportAllFunctions(require('./binary/websocket_pages/mb_trade/mb_price'));
exportAllFunctions(require('./binary/websocket_pages/trade/process'));
exportAllFunctions(require('./binary/websocket_pages/trade/beta/process'));
