// TODO: to be remove after webpack finalized
var exportAllFunctions = function exportAllFunctions(obj) {
    for ( var key in obj ) {
        if ( obj.hasOwnProperty(key) ) {
            window[key] = obj[key];
        }
    }
};

window.$ = window.jQuery = require('jquery');

require('./lib/highstock/highstock.js');
require('./lib/highstock/highstock-exporting.js');
require('./lib/highstock/export-csv.js');
require('./lib/mmenu/jquery.mmenu.min.all.js');
require('./lib/jquery-ui-timepicker/jquery.ui.timepicker.js');
require('event-source-polyfill');
require('./lib/jQuery.XDomainRequest.js');
require('./lib/jquery-ui.js');
require('./lib/jquery.sparkline.js');
require('jquery.scrollto');

require('./binary/components/trackjs_onerror');
require('./binary/static_pages/static_pjax');
require('./binary/websocket_pages/websocket_pjax');

exportAllFunctions(require('./binary/base/logged_in'));
exportAllFunctions(require('./binary/base/page'));

exportAllFunctions(require('./binary/websocket_pages/socket'));
exportAllFunctions(require('./binary/websocket_pages/mb_trade/mb_price'));
exportAllFunctions(require('./binary/websocket_pages/trade/process'));
exportAllFunctions(require('./binary/websocket_pages/trade/beta/process'));
