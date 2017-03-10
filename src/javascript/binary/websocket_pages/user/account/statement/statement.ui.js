const Statement           = require('../statement');
const Client              = require('../../../../base/client').Client;
const downloadCSV         = require('../../../../base/utility').downloadCSV;
const localize            = require('../../../../base/localize').localize;
const toJapanTimeIfNeeded = require('../../../../base/clock').Clock.toJapanTimeIfNeeded;
const Button              = require('../../../../common_functions/attach_dom/button').Button;
const Content             = require('../../../../common_functions/content').Content;
const japanese_client     = require('../../../../common_functions/country_base').japanese_client;
const showTooltip         = require('../../../../common_functions/get_app_details').showTooltip;
const Table               = require('../../../../common_functions/attach_dom/table').Table;

const StatementUI = (() => {
    'use strict';

    let all_data = [],
        oauth_apps = {};

    const table_id = 'statement-table',
        columns = ['date', 'ref', 'payout', 'act', 'desc', 'credit', 'bal', 'details'];

    const createEmptyStatementTable = () => {
        const header = [
            Content.localize().textDate,
            Content.localize().textRef,
            localize('Potential Payout'),
            localize('Action'),
            localize('Description'),
            localize('Credit/Debit'),
            localize('Balance'),
            Content.localize().textDetails,
        ];

        const jp_client = japanese_client(),
            currency = Client.get('currency');

        header[6] += (jp_client || !currency ? '' : ' (' + currency + ')');

        const metadata = {
            id  : table_id,
            cols: columns,
        };
        const data = [];
        return Table.createFlexTable(data, metadata, header);
    };

    const clearTableContent = () => {
        Table.clearTableBody(table_id);
        all_data = [];
        $('#' + table_id + '>tfoot').hide();
    };

    const createStatementRow = (transaction) => {
        const statement_data = Statement.getStatementData(transaction, Client.get('currency'), japanese_client());
        all_data.push($.extend({}, statement_data, {
            action: localize(statement_data.action),
            desc  : localize(statement_data.desc),
        }));
        const credit_debit_type = (parseFloat(transaction.amount) >= 0) ? 'profit' : 'loss';

        const $statement_row = Table.createFlexTableRow([
            statement_data.date,
            '<span' + showTooltip(statement_data.app_id, oauth_apps[statement_data.app_id]) + '>' + statement_data.ref + '</span>',
            statement_data.payout,
            localize(statement_data.action),
            '',
            statement_data.amount,
            statement_data.balance,
            '',
        ], columns, 'data');

        $statement_row.children('.credit').addClass(credit_debit_type);
        $statement_row.children('.date').addClass('pre');
        $statement_row.children('.desc').html(localize(statement_data.desc) + '<br>');

        // create view button and append
        if (statement_data.action === 'Sell' || statement_data.action === 'Buy') {
            const $view_button_span = Button.createBinaryStyledButton();
            const $view_button = $view_button_span.children('.button').first();
            $view_button.text(localize('View'));
            $view_button.addClass('open_contract_detailsws');
            $view_button.attr('contract_id', statement_data.id);

            $statement_row.children('.desc,.details').append($view_button_span);
        }

        return $statement_row[0];        // return DOM instead of jquery object
    };

    const updateStatementTable = (transactions) => {
        Table.appendTableBody(table_id, transactions, createStatementRow);
    };

    const errorMessage = (msg) => {
        const $err = $('#statement-ws-container').find('#error-msg');
        if (msg) {
            $err.removeClass('invisible').text(msg);
        } else {
            $err.addClass('invisible').text('');
        }
    };

    const exportCSV = () => {
        downloadCSV(
            Statement.generateCSV(all_data, japanese_client()),
            'Statement_' + Client.get('loginid') + '_latest' + $('#rows_count').text() + '_' +
                toJapanTimeIfNeeded(window.time).replace(/\s/g, '_').replace(/:/g, '') + '.csv');
    };

    return {
        clearTableContent        : clearTableContent,
        createEmptyStatementTable: createEmptyStatementTable,
        updateStatementTable     : updateStatementTable,
        errorMessage             : errorMessage,
        exportCSV                : exportCSV,
        setOauthApps             : values => (oauth_apps = values),
    };
})();

module.exports = StatementUI;
