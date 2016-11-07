// TODO: to be remove after webpack finalized
var exportAllFunctions = function exportAllFunctions(obj) {
    for ( var key in obj ) {
        if ( obj.hasOwnProperty(key) ) {
            window[key] = obj[key];
        }
    }
};

window.$ = window.jQuery = require('jquery');

// Polyfills
window.Promise = window.Promise || require('promise-polyfill');
window.Symbol = window.Symbol || require('es6-symbol');
require('./lib/polyfills/array.includes');
require('./lib/polyfills/string.includes');
require('./lib/polyfills/object.assign');

window.EnjoyHint = require('./lib/guide.enjoyhint.js');
require('./lib/highstock/highstock.js');
require('./lib/highstock/highstock-exporting.js');
require('./lib/highstock/export-csv.js');
window.moment = require('./lib/moment/moment');
require('./lib/mmenu/jquery.mmenu.min.all.js');
require('./lib/jquery-ui-timepicker/jquery.ui.timepicker.js');
exportAllFunctions(require('./lib/done-typing'));
exportAllFunctions(require('./lib/form-to-obj'));
require('event-source-polyfill');
require('./lib/jQuery.XDomainRequest.js');
require('./lib/jquery-scrollto-1.4.3.1-min.js');
require('./lib/jquery-ui.js');
require('./lib/jquery.sparkline.js');
window.Cookies = require('./lib/js-cookie.js');
exportAllFunctions(require('./lib/loadCSS'));
exportAllFunctions(require('./lib/loadJS'));
window.pjax = require('./lib/pjax-lib.js');
window.ResizeSensor = require('./lib/resize-sensor.js');
window.dv = require('./lib/validation.js');

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

exportAllFunctions(require('./binary/websocket_pages/user/account/settings/authorised_apps/authorised_apps.data'));
exportAllFunctions(require('./binary/websocket_pages/user/account/settings/authorised_apps/authorised_apps.init'));
exportAllFunctions(require('./binary/websocket_pages/user/account/settings/authorised_apps/authorised_apps.ui'));
exportAllFunctions(require('./binary/websocket_pages/user/account/settings/authorised_apps'));
exportAllFunctions(require('./binary/websocket_pages/user/account/settings/financial_assessment'));
exportAllFunctions(require('./binary/websocket_pages/user/account/settings/iphistory/iphistory.data'));
exportAllFunctions(require('./binary/websocket_pages/user/account/settings/iphistory/iphistory.init'));
exportAllFunctions(require('./binary/websocket_pages/user/account/settings/iphistory/iphistory.ui'));
exportAllFunctions(require('./binary/websocket_pages/user/account/settings/iphistory'));
exportAllFunctions(require('./binary/websocket_pages/user/account/settings/limits/limits.init'));
exportAllFunctions(require('./binary/websocket_pages/user/account/settings/limits/limits.ui'));
exportAllFunctions(require('./binary/websocket_pages/user/account/settings/limits'));
exportAllFunctions(require('./binary/websocket_pages/user/account/settings/self_exclusion'));
exportAllFunctions(require('./binary/websocket_pages/user/account/settings/settings_detailsws'));
exportAllFunctions(require('./binary/websocket_pages/user/account/settings/settings_securityws'));
exportAllFunctions(require('./binary/websocket_pages/user/account/settings'));
exportAllFunctions(require('./binary/websocket_pages/user/account/statement/statement.data'));
exportAllFunctions(require('./binary/websocket_pages/user/account/statement/statement.init'));
exportAllFunctions(require('./binary/websocket_pages/user/account/statement/statement.ui'));

exportAllFunctions(require('./binary/websocket_pages/user/account/statement'));

exportAllFunctions(require('./binary/websocket_pages/user/account/top_up_virtualws'));
exportAllFunctions(require('./binary/websocket_pages/user/lost_password/lost_password.init'));
exportAllFunctions(require('./binary/websocket_pages/user/lost_password'));
exportAllFunctions(require('./binary/websocket_pages/user/new_account/financial_acc_opening/financial_acc_opening.data'));
exportAllFunctions(require('./binary/websocket_pages/user/new_account/financial_acc_opening/financial_acc_opening.ui'));
exportAllFunctions(require('./binary/websocket_pages/user/new_account/financial_acc_opening'));
exportAllFunctions(require('./binary/websocket_pages/user/new_account/japan_acc_opening/japan_acc_opening.data'));
exportAllFunctions(require('./binary/websocket_pages/user/new_account/japan_acc_opening/japan_acc_opening.ui'));
exportAllFunctions(require('./binary/websocket_pages/user/new_account/japan_acc_opening'));
exportAllFunctions(require('./binary/websocket_pages/user/new_account/real_acc_opening/real_acc_opening.data'));
exportAllFunctions(require('./binary/websocket_pages/user/new_account/real_acc_opening/real_acc_opening.ui'));
exportAllFunctions(require('./binary/websocket_pages/user/new_account/real_acc_opening'));
exportAllFunctions(require('./binary/websocket_pages/user/new_account/virtual_acc_opening/virtual_acc_opening.data'));
exportAllFunctions(require('./binary/websocket_pages/user/new_account/virtual_acc_opening'));
exportAllFunctions(require('./binary/websocket_pages/user/reality_check/reality_check.data'));
exportAllFunctions(require('./binary/websocket_pages/user/reality_check/reality_check.init'));
exportAllFunctions(require('./binary/websocket_pages/user/reality_check/reality_check.ui'));
exportAllFunctions(require('./binary/websocket_pages/user/reset_password/reset_password.init'));
exportAllFunctions(require('./binary/websocket_pages/user/reset_password'));
exportAllFunctions(require('./binary/websocket_pages/user/tnc_approval'));
exportAllFunctions(require('./binary/websocket_pages/user/view_popup/view_popup_ui'));
exportAllFunctions(require('./binary/websocket_pages/user/view_popup/view_popupws'));
exportAllFunctions(require('./binary/websocket_pages/user/viewbalance/viewbalance.init'));
exportAllFunctions(require('./binary/websocket_pages/user/viewbalance/viewbalance.ui'));
exportAllFunctions(require('./binary/websocket_pages/websocket_pjax'));
exportAllFunctions(require('./binary_japan/knowledge_test/knowledge_test.data'));
exportAllFunctions(require('./binary_japan/knowledge_test/knowledge_test.init'));
exportAllFunctions(require('./binary_japan/knowledge_test/knowledge_test.ui'));
exportAllFunctions(require('./binary_japan/knowledge_test'));
exportAllFunctions(require('./binary_japan/cashier'));
exportAllFunctions(require('./binary_japan/trade_japan/JPTradePage'));
exportAllFunctions(require('./binary_japan/trade_japan/portfolio'));
exportAllFunctions(require('./binary_japan/trade_japan/pricing_details'));
exportAllFunctions(require('./config'));
