// TODO: to be remove after webpack finalized
var exportAllFunctions = function exportAllFunctions(obj) {
    for ( var key in obj ) {
        if ( obj.hasOwnProperty(key) ) {
            window[key] = obj[key];
        }
    }
};

window.$ = window.jQuery = require('jquery');

// Polyfills : needed only for japanui
window.Promise = window.Promise || require('promise-polyfill');
window.Symbol = window.Symbol || require('es6-symbol');
require('./lib/polyfills/object.assign');

require('./lib/highstock/highstock.js');
require('./lib/highstock/highstock-exporting.js');
require('./lib/highstock/export-csv.js');
require('./lib/mmenu/jquery.mmenu.min.all.js');
require('./lib/jquery-ui-timepicker/jquery.ui.timepicker.js');
require('event-source-polyfill');
require('./lib/jQuery.XDomainRequest.js');
require('./lib/jquery-ui.js');
require('./lib/jquery.sparkline.js');

require('./binary/components/trackjs_onerror');

exportAllFunctions(require('./binary/base/logged_in'));
exportAllFunctions(require('./binary/base/onerror'));
exportAllFunctions(require('./binary/base/page'));
exportAllFunctions(require('./binary/base/pjax'));

exportAllFunctions(require('./binary/static_pages/static_pjax'));

exportAllFunctions(require('./binary/websocket_pages/trade/content'));
exportAllFunctions(require('./binary/websocket_pages/socket'));
exportAllFunctions(require('./binary/websocket_pages/mb_trade/mb_price'));
exportAllFunctions(require('./binary/websocket_pages/trade/analysis'));
exportAllFunctions(require('./binary/websocket_pages/trade/barriers'));
exportAllFunctions(require('./binary/websocket_pages/trade/charts/digit_infows'));
exportAllFunctions(require('./binary/websocket_pages/trade/charts/highchartws'));
exportAllFunctions(require('./binary/websocket_pages/trade/common'));
exportAllFunctions(require('./binary/websocket_pages/trade/contract'));
exportAllFunctions(require('./binary/websocket_pages/trade/currency'));
exportAllFunctions(require('./binary/websocket_pages/trade/defaults'));
exportAllFunctions(require('./binary/websocket_pages/trade/duration'));
exportAllFunctions(require('./binary/websocket_pages/trade/event'));
exportAllFunctions(require('./binary/websocket_pages/trade/message'));
exportAllFunctions(require('./binary/websocket_pages/trade/price'));
exportAllFunctions(require('./binary/websocket_pages/trade/process'));
exportAllFunctions(require('./binary/websocket_pages/trade/purchase'));
exportAllFunctions(require('./binary/websocket_pages/trade/starttime'));
exportAllFunctions(require('./binary/websocket_pages/trade/symbols'));
exportAllFunctions(require('./binary/websocket_pages/trade/tick'));
exportAllFunctions(require('./binary/websocket_pages/trade/tick_trade'));
exportAllFunctions(require('./binary/websocket_pages/trade/tradepage'));
exportAllFunctions(require('./binary/websocket_pages/trade/beta/analysis'));
exportAllFunctions(require('./binary/websocket_pages/trade/beta/barriers'));
exportAllFunctions(require('./binary/websocket_pages/trade/beta/charts/digit_infows'));
exportAllFunctions(require('./binary/websocket_pages/trade/beta/contract'));
exportAllFunctions(require('./binary/websocket_pages/trade/beta/duration'));
exportAllFunctions(require('./binary/websocket_pages/trade/beta/event'));
exportAllFunctions(require('./binary/websocket_pages/trade/beta/message'));
exportAllFunctions(require('./binary/websocket_pages/trade/beta/price'));
exportAllFunctions(require('./binary/websocket_pages/trade/beta/process'));
exportAllFunctions(require('./binary/websocket_pages/trade/beta/purchase'));
exportAllFunctions(require('./binary/websocket_pages/trade/beta/starttime'));
exportAllFunctions(require('./binary/websocket_pages/trade/beta/tick_trade'));
exportAllFunctions(require('./binary/websocket_pages/trade/beta/tradepage'));

exportAllFunctions(require('./binary/websocket_pages/user/reality_check/reality_check.data'));
exportAllFunctions(require('./binary/websocket_pages/user/reality_check/reality_check.init'));
exportAllFunctions(require('./binary/websocket_pages/user/reality_check/reality_check.ui'));

exportAllFunctions(require('./binary/websocket_pages/websocket_pjax'));
exportAllFunctions(require('./binary_japan/knowledge_test/knowledge_test.data'));
exportAllFunctions(require('./binary_japan/knowledge_test/knowledge_test.init'));
exportAllFunctions(require('./binary_japan/knowledge_test/knowledge_test.ui'));
exportAllFunctions(require('./binary_japan/knowledge_test'));
exportAllFunctions(require('./binary_japan/trade_japan/JPTradePage'));
exportAllFunctions(require('./binary_japan/trade_japan/portfolio'));
exportAllFunctions(require('./binary_japan/trade_japan/pricing_details'));
exportAllFunctions(require('./config'));
