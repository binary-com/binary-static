const moment               = require('moment');
const showLocalTimeOnHover = require('../../../../../base/clock').showLocalTimeOnHover;
const FlexTableUI          = require('../../../../../common/attach_dom/flextable');
const localize             = require('../../../../../../_common/localize').localize;

const IPHistoryUI = (() => {
    const container_selector = '#login-history-container';
    const no_messages_error  = 'Your account has no Login/Logout activity.';

    const init = () => {
        const $title = $('#login_history-title').children().first();
        $title.text(localize($title.text()));
    };

    const formatRow = (data) => {
        const timestamp    = `${moment.unix(data.time).utc().format('YYYY-MM-DD HH:mm:ss').replace(' ', '\n')} GMT`;
        const status       = localize(data.success ? 'Successful' : 'Failed');
        const action       = localize(data.action);
        const browser      = data.browser;
        let browser_string = browser ? `${browser.name} v${browser.version}` : 'Unknown';
        const patt         = /^(opera|chrome|safari|firefox|IE|Edge|SeaMonkey|Chromium|Binary app) v[0-9.]+$/i;
        if (!patt.test(browser_string) && browser_string !== 'Unknown') {
            browser_string = 'Error';
        }
        return [
            timestamp,
            action,
            browser_string,
            data.ip_addr,
            status,
        ];
    };

    const update = (history) => {
        const headers = ['Date and Time', 'Action', 'Browser', 'IP Address', 'Status'];
        const columns = ['timestamp', 'action', 'browser', 'ip', 'status'];
        FlexTableUI.init({
            id       : 'login-history-table',
            container: container_selector,
            header   : headers.map(s => localize(s)),
            cols     : columns,
            data     : history,
            formatter: formatRow,
            style    : ($row) => {
                $row.children('.timestamp').addClass('pre');
            },
        });
        if (!history.length) {
            return FlexTableUI.displayError(localize(no_messages_error), 6);
        }
        return showLocalTimeOnHover('td.timestamp');
    };

    const clean = () => {
        $(container_selector).find('.error-msg').text('');
        FlexTableUI.clear();
    };

    const displayError = (error) => {
        $('#err').text(error);
    };

    return {
        init,
        clean,
        update,
        displayError,
    };
})();

module.exports = IPHistoryUI;
