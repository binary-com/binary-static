const Statement           = require('../statement');
const Client              = require('../../../../base/client');
const downloadCSV         = require('../../../../base/utility').downloadCSV;
const localize            = require('../../../../base/localize').localize;
const toJapanTimeIfNeeded = require('../../../../base/clock').toJapanTimeIfNeeded;
const jpClient            = require('../../../../common_functions/country_base').jpClient;
const showTooltip         = require('../../../../common_functions/get_app_details').showTooltip;
const Table               = require('../../../../common_functions/attach_dom/table');

const StatementUI = (() => {
    'use strict';

    let all_data = [],
        oauth_apps = {},
        sortMessageShown = true;

    const table_id = 'statement-table';
    const columns = ['date', 'ref', 'payout', 'act', 'desc', 'credit', 'bal'];

    const createEmptyStatementTable = () => {
        const header = [
            localize('Date'),
            localize('Ref.'),
            localize('Potential Payout'),
            localize('Action'),
            localize('Description'),
            localize('Credit/Debit'),
            localize('Balance'),
        ];

        const jp_client = jpClient();
        const currency = Client.get('currency');

        header[6] += (jp_client || !currency ? '' : ` (${currency})`);

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
        $(`#${table_id} > tfoot`).hide();
    };

    const createStatementRow = (transaction) => {
        const statement_data = Statement.getStatementData(transaction, Client.get('currency'), jpClient());
        all_data.push($.extend({}, statement_data, {
            action: localize(statement_data.action),
            desc  : localize(statement_data.desc),
        }));
        const credit_debit_type = (parseFloat(transaction.amount) >= 0) ? 'profit' : 'loss';

        const $statement_row = Table.createFlexTableRow([
            statement_data.date,
            `<span ${showTooltip(statement_data.app_id, oauth_apps[statement_data.app_id])}>${statement_data.ref}</span>`,
            statement_data.payout,
            localize(statement_data.action),
            '',
            statement_data.amount,
            statement_data.balance,
        ], columns, 'data');

        $statement_row.children('.credit').addClass(credit_debit_type);
        $statement_row.children('.date').addClass('pre');
        $statement_row.children('.desc').html(`${localize(statement_data.desc)}<br>`);

        // make the entire row clickable
        if (statement_data.action === 'Sell' || statement_data.action === 'Buy') {
            // make the entire row clickable
            $statement_row.attr('contract_id', statement_data.id);
            $statement_row.addClass('open_contract_details_slider');
            $statement_row.addClass('pointerCursor');
        }

        return $statement_row[0];        // return DOM instead of jquery object
    };

    const updateStatementTable = (transactions) => {
        Table.appendTableBody(table_id, transactions, createStatementRow);
    };

    const errorMessage = (msg) => {
        const $err = $('#statement-container').find('#error-msg');
        if (msg) {
            $err.setVisibility(1).text(msg);
        } else {
            $err.setVisibility(0).text('');
        }
    };

    const exportCSV = () => {
        downloadCSV(
            Statement.generateCSV(all_data, jpClient()),
            `Statement_${Client.get('loginid')}_latest${$('#rows_count').text()}_${toJapanTimeIfNeeded(window.time).replace(/\s/g, '_').replace(/:/g, '')}.csv`);
    };

    const showSortMessage = () => {
        if (!sortMessageShown && $('.sortModeBox') !== undefined) {
            $('.sortModeBox').animate({
                top: '90%',
            }, 100, () => {
                sortMessageShown = true;
            });
        }
    };

    const hideSortMessage = () => {
        if (sortMessageShown && $('.sortModeBox') !== undefined) {
            $('.sortModeBox').animate({
                top: '100%',
            }, 100, () => {
                sortMessageShown = false;
            });
        }
    };

    const renewSortMessage = (message) => {
        const sortMessage = ('Sort mode : ').concat('<br>').concat(message);
        $('.sortModeBox').find('.sortMessage').html(sortMessage);
    };

    const makeSortMessage = () => {
        const sortModeBox = $('<div>', { class: 'sortModeBox' });
        sortModeBox.append('<div class="sortMessage"></div>');
        return sortModeBox;
    };

    const getStatementTable = () => $('#statement-table');

    const cloneStatementTableHeader = () => getStatementTable().find('thead').clone();

    const makeStickyTable = () => $('<table>', { id: 'statement-table', class: 'sticky' });

    const resizeStickyTable = () => {
        $('.sticky').css('width', getStatementTable().css('width'));
    };

    const resizeStickyTableHeader = (referenceArray) => {
        const stickyHeaderItems = $('.sticky').find('tr').children('th');
        for (let i = 0; i < stickyHeaderItems.length; i++) {
            stickyHeaderItems.eq(i).width(referenceArray.eq(i).width());
        }
    };

    const stickyHeaderScrollLeft = () => {
        $('.sticky').css('left', -($('.table-container').scrollLeft() - ($(document).width() * 0.01)));
    };

    return {
        clearTableContent        : clearTableContent,
        createEmptyStatementTable: createEmptyStatementTable,
        updateStatementTable     : updateStatementTable,
        errorMessage             : errorMessage,
        exportCSV                : exportCSV,
        makeSortMessage          : makeSortMessage,
        showSortMessage          : showSortMessage,
        hideSortMessage          : hideSortMessage,
        renewSortMessage         : renewSortMessage,
        getStatementTable        : getStatementTable,
        cloneStatementTableHeader: cloneStatementTableHeader,
        makeStickyTable          : makeStickyTable,
        resizeStickyTable        : resizeStickyTable,
        resizeStickyTableHeader  : resizeStickyTableHeader,
        stickyHeaderScrollLeft   : stickyHeaderScrollLeft,
        setOauthApps             : values => (oauth_apps = values),
    };
})();

module.exports = StatementUI;
