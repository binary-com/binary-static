const moment              = require('moment');
const Client              = require('../../../../base/client');
const toJapanTimeIfNeeded = require('../../../../base/clock').toJapanTimeIfNeeded;
const formatCurrency      = require('../../../../common/currency').formatCurrency;
const formatMoney         = require('../../../../common/currency').formatMoney;
const localize            = require('../../../../../_common/localize').localize;
const toTitleCase         = require('../../../../../_common/string_util').toTitleCase;

const Statement = (() => {
    const getStatementData = (statement, currency, jp_client) => {
        const date_obj   = new Date(statement.transaction_time * 1000);
        const moment_obj = moment.utc(date_obj);
        const date_str   = moment_obj.format('YYYY-MM-DD');
        const time_str   = `${moment_obj.format('HH:mm:ss')} GMT`;
        const payout     = parseFloat(statement.payout);
        const amount     = parseFloat(statement.amount);
        const balance    = parseFloat(statement.balance_after);
        const is_ico_bid = /binaryico/i.test(statement.shortcode); // TODO: remove ico exception when all ico contracts are removed

        let action = toTitleCase(statement.action_type);
        if (is_ico_bid) {
            action = /buy/i.test(statement.action_type) ? localize('Bid') : localize('Closed Bid');
        }

        return {
            action,
            date   : jp_client ? toJapanTimeIfNeeded(+statement.transaction_time) : `${date_str}\n${time_str}`,
            ref    : statement.transaction_id,
            payout : isNaN(payout) || is_ico_bid || !+payout ? '-' : formatMoney(currency, payout, !jp_client),
            amount : isNaN(amount) ? '-' : formatMoney(currency, amount, !jp_client),
            balance: isNaN(balance) ? '-' : formatMoney(currency, balance, !jp_client),
            desc   : statement.longcode.replace(/\n/g, '<br />'),
            id     : statement.contract_id,
            app_id : statement.app_id,
        };
    };

    const generateCSV = (all_data, jp_client) => {
        const columns  = ['date', 'ref', 'payout', 'action', 'desc', 'amount', 'balance'];
        const header   = ['Date', 'Reference ID', 'Potential Payout', 'Action', 'Description', 'Credit/Debit'].map(str => (localize(str)));
        const currency = Client.get('currency');
        header.push(localize('Balance') + (jp_client || !currency ? '' : ` (${currency})`));
        const sep = ',';
        let csv   = [header.join(sep)];
        if (all_data && all_data.length > 0) {
            // eslint-disable-next-line no-control-regex
            csv = csv.concat(all_data.map(data => columns.map(key => (data[key] ? data[key].replace(formatCurrency(currency), '¥').replace(new RegExp(sep, 'g'), '').replace(new RegExp('\n|<br />', 'g'), ' ') : '')).join(sep)));
        }
        return csv.join('\r\n');
    };

    return {
        getStatementData,
        generateCSV,
    };
})();

module.exports = Statement;
