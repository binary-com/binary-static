const toJapanTimeIfNeeded = require('../../../../base/clock').Clock.toJapanTimeIfNeeded;
const localize            = require('../../../../base/localize').localize;
const Client              = require('../../../../base/client').Client;
const Button              = require('../../../../common_functions/attach_dom/button').Button;
const Content             = require('../../../../common_functions/content').Content;
const Table               = require('../../../../common_functions/attach_dom/table').Table;
const format_money        = require('../../../../common_functions/currency_to_symbol').format_money;
const showTooltip         = require('../../../../common_functions/get_app_details').showTooltip;
const japanese_client     = require('../../../../common_functions/country_base').japanese_client;
const addComma            = require('../../../../common_functions/string_util').addComma;
const ProfitTable         = require('../profit_table').ProfitTable;
const elementTextContent  = require('../../../../common_functions/common_functions').elementTextContent;

const ProfitTableUI = (function() {
    'use strict';

    const profitTableID = 'profit-table',
        cols = ['buy-date', 'ref', 'payout', 'contract', 'buy-price', 'sell-date', 'sell-price', 'pl', 'details'];
    let oauth_apps = {},
        currency;

    const createEmptyTable = function() {
        const header = [
            Content.localize().textDate,
            Content.localize().textRef,
            localize('Potential Payout'),
            Content.localize().textContract,
            Content.localize().textPurchasePrice,
            Content.localize().textSaleDate,
            Content.localize().textSalePrice,
            Content.localize().textProfitLoss,
            Content.localize().textDetails,
        ];

        const jpClient = japanese_client();
        currency = Client.get('currency');

        header[7] += (jpClient ? '' : (currency ? ' (' + currency + ')' : ''));

        const footer = [Content.localize().textTotalProfitLoss, '', '', '', '', '', '', '', ''];

        const data = [];
        const metadata = {
            cols: cols,
            id  : profitTableID,
        };
        const $tableContainer = Table.createFlexTable(data, metadata, header, footer);

        $tableContainer
            .children('table')
            .children('tfoot')
            .children('tr')
            .attr('id', 'pl-day-total');

        return $tableContainer;
    };

    const updateFooter = function(transactions) {
        let accTotal = elementTextContent(document.querySelector('#pl-day-total > .pl'));
        accTotal = parseFloat(accTotal.replace(/,/g, ''));
        if (!accTotal || isNaN(accTotal)) {
            accTotal = 0;
        }

        const currentTotal = transactions.reduce(function(previous, current) {
            const buyPrice  = Number(parseFloat(current.buy_price));
            const sellPrice = Number(parseFloat(current.sell_price));
            const pl = sellPrice - buyPrice;
            return previous + pl;
        }, 0);

        const total = accTotal + currentTotal,
            jpClient = japanese_client(),
            subTotalType = (total >= 0) ? 'profit' : 'loss';

        $('#pl-day-total').find(' > .pl').text(jpClient ? format_money(currency, total) : addComma(Number(total).toFixed(2)))
            .removeClass('profit loss')
            .addClass(subTotalType);
    };

    const createProfitTableRow = function(transaction) {
        const profit_table_data = ProfitTable.getProfitTabletData(transaction);
        const plType = (profit_table_data.pl >= 0) ? 'profit' : 'loss';

        const jpClient = japanese_client();

        const data = [jpClient ? toJapanTimeIfNeeded(transaction.purchase_time) : profit_table_data.buyDate, '<span' + showTooltip(profit_table_data.app_id, oauth_apps[profit_table_data.app_id]) + '>' + profit_table_data.ref + '</span>', jpClient ? format_money(currency, profit_table_data.payout) : profit_table_data.payout, '', jpClient ? format_money(currency, profit_table_data.buyPrice) : profit_table_data.buyPrice, (jpClient ? toJapanTimeIfNeeded(transaction.sell_time) : profit_table_data.sellDate), jpClient ? format_money(currency, profit_table_data.sellPrice) : profit_table_data.sellPrice, jpClient ? format_money(currency, profit_table_data.pl) : profit_table_data.pl, ''];
        const $row = Table.createFlexTableRow(data, cols, 'data');

        $row.children('.pl').addClass(plType);
        $row.children('.contract').html(profit_table_data.desc + '<br>');
        $row.children('.buy-date').each(function() {
            $(this).wrapInner('<div class="new-width"></div>');
        });
        $row.children('.sell-date').each(function() {
            $(this).wrapInner('<div class="new-width"></div>');
        });

        // create view button and append
        const $viewButtonSpan = Button.createBinaryStyledButton();
        const $viewButton = $viewButtonSpan.children('.button').first();
        $viewButton.text(localize('View'));
        $viewButton.addClass('open_contract_detailsws');
        $viewButton.attr('contract_id', profit_table_data.id);

        $row.children('.contract,.details').append($viewButtonSpan);

        return $row[0];
    };

    const updateProfitTable = function(transactions) {
        Table.appendTableBody(profitTableID, transactions, createProfitTableRow);
        updateFooter(transactions);
    };

    const clearTableContent = function() {
        Table.clearTableBody(profitTableID);
        $('#' + profitTableID + '>tfoot').hide();
    };

    const errorMessage = function(msg) {
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
        setOauthApps     : function(values) {
            return (oauth_apps = values);
        },
    };
})();

module.exports = {
    ProfitTableUI: ProfitTableUI,
};
