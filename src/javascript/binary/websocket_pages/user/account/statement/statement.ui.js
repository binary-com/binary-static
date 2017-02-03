const toJapanTimeIfNeeded = require('../../../../base/clock').Clock.toJapanTimeIfNeeded;
const downloadCSV         = require('../../../../base/utility').downloadCSV;
const Button          = require('../../../../common_functions/attach_dom/button').Button;
const Content         = require('../../../../common_functions/content').Content;
const Table           = require('../../../../common_functions/attach_dom/table').Table;
const showTooltip     = require('../../../../common_functions/get_app_details').showTooltip;
const japanese_client = require('../../../../common_functions/country_base').japanese_client;
const Statement = require('../statement').Statement;
const localize  = require('../../../../base/localize').localize;
const Client    = require('../../../../base/client').Client;

const StatementUI = (function() {
    'use strict';

    const tableID = 'statement-table',
        columns = ['date', 'ref', 'payout', 'act', 'desc', 'credit', 'bal', 'details'];
    let allData = [],
        oauth_apps = {};

    const createEmptyStatementTable = function() {
        const header = [
            Content.localize().textDate,
            Content.localize().textRef,
            localize('Potential Payout'),
            Content.localize().textAction,
            Content.localize().textDescription,
            Content.localize().textCreditDebit,
            Content.localize().textBalance,
            Content.localize().textDetails,
        ];

        const jpClient = japanese_client(),
            currency = Client.get('currency');

        header[6] += (jpClient || !currency ? '' : ' (' + currency + ')');

        const metadata = {
            id  : tableID,
            cols: columns,
        };
        const data = [];
        return Table.createFlexTable(data, metadata, header);
    };

    const clearTableContent = function() {
        Table.clearTableBody(tableID);
        allData = [];
        $('#' + tableID + '>tfoot').hide();
    };

    const createStatementRow = function(transaction) {
        const statement_data = Statement.getStatementData(transaction, Client.get('currency'), japanese_client());
        allData.push($.extend({}, statement_data, {
            action: localize(statement_data.action),
            desc  : localize(statement_data.desc),
        }));
        const creditDebitType = (parseFloat(transaction.amount) >= 0) ? 'profit' : 'loss';

        const $statementRow = Table.createFlexTableRow([
            statement_data.date,
            '<span' + showTooltip(statement_data.app_id, oauth_apps[statement_data.app_id]) + '>' + statement_data.ref + '</span>',
            statement_data.payout,
            localize(statement_data.action),
            '',
            statement_data.amount,
            statement_data.balance,
            '',
        ], columns, 'data');

        $statementRow.children('.credit').addClass(creditDebitType);
        $statementRow.children('.date').addClass('pre');
        $statementRow.children('.desc').html(localize(statement_data.desc) + '<br>');

        // create view button and append
        if (statement_data.action === 'Sell' || statement_data.action === 'Buy') {
            const $viewButtonSpan = Button.createBinaryStyledButton();
            const $viewButton = $viewButtonSpan.children('.button').first();
            $viewButton.text(localize('View'));
            $viewButton.addClass('open_contract_detailsws');
            $viewButton.attr('contract_id', statement_data.id);

            $statementRow.children('.desc,.details').append($viewButtonSpan);
        }

        return $statementRow[0];        // return DOM instead of jquery object
    };

    const updateStatementTable = function(transactions) {
        Table.appendTableBody(tableID, transactions, createStatementRow);
    };

    const errorMessage = function(msg) {
        const $err = $('#statement-ws-container').find('#error-msg');
        if (msg) {
            $err.removeClass('invisible').text(msg);
        } else {
            $err.addClass('invisible').text('');
        }
    };

    const exportCSV = function() {
        downloadCSV(
            Statement.generateCSV(allData, japanese_client()),
            'Statement_' + Client.get('loginid') + '_latest' + $('#rows_count').text() + '_' +
                toJapanTimeIfNeeded(window.time).replace(/\s/g, '_').replace(/:/g, '') + '.csv');
    };

    return {
        clearTableContent        : clearTableContent,
        createEmptyStatementTable: createEmptyStatementTable,
        updateStatementTable     : updateStatementTable,
        errorMessage             : errorMessage,
        exportCSV                : exportCSV,
        setOauthApps             : function(values) { return (oauth_apps = values); },
    };
})();

module.exports = {
    StatementUI: StatementUI,
};
