const ProfitTable         = require('../profit_table');
const Client              = require('../../../../base/client').Client;
const localize            = require('../../../../base/localize').localize;
const toJapanTimeIfNeeded = require('../../../../base/clock').Clock.toJapanTimeIfNeeded;
const addComma            = require('../../../../common_functions/string_util').addComma;
const Button              = require('../../../../common_functions/attach_dom/button').Button;
const Content             = require('../../../../common_functions/content').Content;
const elementTextContent  = require('../../../../common_functions/common_functions').elementTextContent;
const format_money        = require('../../../../common_functions/currency_to_symbol').format_money;
const japanese_client     = require('../../../../common_functions/country_base').japanese_client;
const showTooltip         = require('../../../../common_functions/get_app_details').showTooltip;
const Table               = require('../../../../common_functions/attach_dom/table').Table;

const ProfitTableUI = (() => {
    'use strict';

    let oauth_apps = {},
        currency;

    const profit_table_id = 'profit-table',
        cols = ['buy-date', 'ref', 'payout', 'contract', 'buy-price', 'sell-date', 'sell-price', 'pl', 'details'];

    const createEmptyTable = () => {
        const header = [
            Content.localize().textDate,
            Content.localize().textRef,
            localize('Potential Payout'),
            localize('Contract'),
            localize('Purchase Price'),
            localize('Sale Date'),
            localize('Sale Price'),
            localize('Profit/Loss'),
            Content.localize().textDetails,
        ];

        const jp_client = japanese_client();
        currency = Client.get('currency');

        header[7] += (jp_client ? '' : (currency ? ' (' + currency + ')' : ''));

        const footer = [localize('Total Profit/Loss'), '', '', '', '', '', '', '', ''];

        const data = [];
        const metadata = {
            cols: cols,
            id  : profit_table_id,
        };
        const $table_container = Table.createFlexTable(data, metadata, header, footer);

        $table_container
            .children('table')
            .children('tfoot')
            .children('tr')
            .attr('id', 'pl-day-total');

        return $table_container;
    };

    const updateFooter = (transactions) => {
        let acc_total = elementTextContent(document.querySelector('#pl-day-total > .pl'));
        acc_total = parseFloat(acc_total.replace(/,/g, ''));
        if (!acc_total || isNaN(acc_total)) {
            acc_total = 0;
        }

        const current_total = transactions.reduce(function(previous, current) {
            const buy_price  = Number(parseFloat(current.buy_price));
            const sell_price = Number(parseFloat(current.sell_price));
            const pl = sell_price - buy_price;
            return previous + pl;
        }, 0);

        const total = acc_total + current_total,
            jp_client = japanese_client(),
            sub_total_type = (total >= 0) ? 'profit' : 'loss';

        $('#pl-day-total').find(' > .pl').text(jp_client ? format_money(currency, total) : addComma(Number(total).toFixed(2)))
            .removeClass('profit loss')
            .addClass(sub_total_type);
    };

    const createProfitTableRow = function(transaction) {
        const profit_table_data = ProfitTable.getProfitTabletData(transaction);
        const pl_type = (profit_table_data.pl >= 0) ? 'profit' : 'loss';

        const jp_client = japanese_client();

        const data = [jp_client ? toJapanTimeIfNeeded(transaction.purchase_time) : profit_table_data.buyDate, '<span' + showTooltip(profit_table_data.app_id, oauth_apps[profit_table_data.app_id]) + '>' + profit_table_data.ref + '</span>', jp_client ? format_money(currency, profit_table_data.payout) : profit_table_data.payout, '', jp_client ? format_money(currency, profit_table_data.buyPrice) : profit_table_data.buyPrice, (jp_client ? toJapanTimeIfNeeded(transaction.sell_time) : profit_table_data.sellDate), jp_client ? format_money(currency, profit_table_data.sellPrice) : profit_table_data.sellPrice, jp_client ? format_money(currency, profit_table_data.pl) : profit_table_data.pl, ''];
        const $row = Table.createFlexTableRow(data, cols, 'data');

        $row.children('.pl').addClass(pl_type);
        $row.children('.contract').html(profit_table_data.desc + '<br>');
        $row.children('.buy-date').each(function() {
            $(this).wrapInner('<div class="new-width"></div>');
        });
        $row.children('.sell-date').each(function() {
            $(this).wrapInner('<div class="new-width"></div>');
        });

        // create view button and append
        const $view_button_span = Button.createBinaryStyledButton();
        const $view_button = $view_button_span.children('.button').first();
        $view_button.text(localize('View'));
        $view_button.addClass('open_contract_detailsws');
        $view_button.attr('contract_id', profit_table_data.id);

        $row.children('.contract,.details').append($view_button_span);

        return $row[0];
    };

    const updateProfitTable = (transactions) => {
        Table.appendTableBody(profit_table_id, transactions, createProfitTableRow);
        updateFooter(transactions);
    };

    const clearTableContent = () => {
        Table.clearTableBody(profit_table_id);
        $('#' + profit_table_id + '>tfoot').hide();
    };

    const errorMessage = (msg) => {
        const $err = $('#profit-table-ws-container').find('#error-msg');
        if (msg) {
            $err.removeClass('invisible').text(msg);
        } else {
            $err.addClass('invisible').text('');
        }
    };

    return {
        createEmptyTable : createEmptyTable,
        updateProfitTable: updateProfitTable,
        cleanTableContent: clearTableContent,
        errorMessage     : errorMessage,
        setOauthApps     : values => (oauth_apps = values),
    };
})();

module.exports = ProfitTableUI;
