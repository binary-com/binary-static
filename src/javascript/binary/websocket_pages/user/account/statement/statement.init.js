const moment               = require('moment');
const StatementUI          = require('./statement.ui');
const Slider               = require('../../slider/slider');
const BinarySocket         = require('../../../socket');
const getLanguage          = require('../../../../base/language').get;
const localize             = require('../../../../base/localize').localize;
const showLocalTimeOnHover = require('../../../../base/clock').showLocalTimeOnHover;
const addTooltip           = require('../../../../common_functions/get_app_details').addTooltip;
const buildOauthApps       = require('../../../../common_functions/get_app_details').buildOauthApps;
const dateValueChanged     = require('../../../../common_functions/common_functions').dateValueChanged;
const jpClient             = require('../../../../common_functions/country_base').jpClient;
const toISOFormat          = require('../../../../common_functions/string_util').toISOFormat;
const DatePicker           = require('../../../../components/date_picker');
const sortingMode          = require('./sortingMode');

const StatementInit = (() => {
    'use strict';

    // Batch refer to number of data get from ws service per request
    // chunk refer to number of data populate to ui for each append
    // receive means receive from ws service
    // consume means consume by UI and displayed to page

    let batch_size,
        chunk_size,
        no_more_data,
        pending,
        current_batch,
        transactions_received,
        transactions_consumed,
        currentSortingMode = sortingMode.DATE_RECENT,
        clonedHeader = null,
        tableRows = [];

    const tableRowsInfo = [];

    const tableExist = () => (document.getElementById('statement-table'));

    const finishedConsumed = () => (transactions_consumed === transactions_received);

    const getStatement = (opts) => {
        const req = { statement: 1, description: 1 };

        if (opts) $.extend(true, req, opts);

        const jump_to_val = $('#jump-to').attr('data-value');
        if (jump_to_val && jump_to_val !== '') {
            req.date_to = moment.utc(jump_to_val).unix() + ((jpClient() ? 15 : 24) * (60 * 60));
            req.date_from = 0;
        }
        BinarySocket.send(req).then((response) => {
            statementHandler(response);
        });
    };

    const getNextBatchStatement = () => {
        getStatement({ offset: transactions_received, limit: batch_size });
        pending = true;
    };

    const getNextChunkStatement = () => {
        const chunk = current_batch.splice(0, chunk_size);
        transactions_consumed += chunk.length;
        $('#rows_count').text(transactions_consumed);
        return chunk;
    };

    const statementHandler = (response) => {
        if (response.error) {
            StatementUI.errorMessage(response.error.message);
            return;
        }

        pending = false;

        const statement = response.statement;
        current_batch = statement.transactions;
        transactions_received += current_batch.length;

        if (current_batch.length < batch_size) {
            no_more_data = true;
        }

        if (!tableExist()) {
            const $header = StatementUI.createEmptyStatementTable();
            headerSorterBinder($header);
            headerPointerCursorAndIcon($header);
            $header.appendTo('#statement-container');
            $('.act, .credit').addClass('nowrap');
            StatementUI.updateStatementTable(getNextChunkStatement());
            $('#statement-container').append(StatementUI.makeSortMessage());
            StatementUI.renewSortMessage(currentSortingMode);
            // Show a message when the table is empty
            if (transactions_received === 0 && current_batch.length === 0) {
                $('#statement-table').find('tbody')
                    .append($('<tr/>', { class: 'flex-tr' })
                        .append($('<td/>', { colspan: 7 })
                            .append($('<p/>', { class: 'notice-msg center-text', text: localize('Your account has no trading activity.') }))));
            } else {
                $('#util_row').setVisibility(1);
                if (getLanguage() === 'JA') {
                    $('#download_csv').setVisibility(1)
                                      .find('a')
                                      .unbind('click')
                                      .click(() => { StatementUI.exportCSV(); });
                }
            }
        }
        showLocalTimeOnHover('td.date');
    };

    const loadStatementChunkWhenScroll = () => {
        $(document).scroll(() => {
            stickyHeaderScrollHandler();
            sortMessageScrollHandler();
            const hidableHeight = (percentage) => {
                const total_hideable = $(document).height() - $(window).height();
                return Math.floor((total_hideable * percentage) / 100);
            };

            const p_from_top = $(document).scrollTop();

            if (!tableExist() || p_from_top < hidableHeight(70)) return;

            if (finishedConsumed() && !no_more_data && !pending) {
                getNextBatchStatement();
                return;
            }

            if (!finishedConsumed()) {
                StatementUI.updateStatementTable(getNextChunkStatement());
                switch (currentSortingMode) {
                    case sortingMode.DATE_LONGTIMEAGO:
                    case sortingMode.DATE_RECENT:
                        orderTableByDate(false);
                        break;
                    case sortingMode.REF_LEAST:
                    case sortingMode.REF_MOST:
                        orderTableByRef(false);
                        break;
                    case sortingMode.PAYOUT_LEAST:
                    case sortingMode.PAYOUT_MOST:
                        orderTableByPayout(false);
                        break;
                    case sortingMode.ACT_BUY:
                    case sortingMode.ACT_SELL:
                        orderTableByAction(false);
                        break;
                    case sortingMode.CREDIT_LOSSES:
                    case sortingMode.CREDIT_PROFIT:
                        orderTableByCredit(false);
                        break;
                    case sortingMode.BAL_LEAST:
                    case sortingMode.BAL_MOST:
                        orderTableByBalance(false);
                        break;
                    default:
                        break;
                }
            }
        });
    };

    const onUnload = () => {
        pending = false;
        no_more_data = false;

        current_batch = [];

        transactions_received = 0;
        transactions_consumed = 0;

        StatementUI.errorMessage(null);
        StatementUI.clearTableContent();
    };

    const initPage = () => {
        batch_size = 200;
        chunk_size = batch_size / 2;
        no_more_data = false;
        pending = false;            // serve as a lock to prevent ws request is sequential
        current_batch = [];
        transactions_received = 0;
        transactions_consumed = 0;

        BinarySocket.send({ oauth_apps: 1 }).then((response) => {
            addTooltip(StatementUI.setOauthApps(buildOauthApps(response)));
            $('.barspinner').setVisibility(0);
        });
        getNextBatchStatement();
        loadStatementChunkWhenScroll();
        bindStickyHeaderResize();
    };

    const attachDatePicker = () => {
        const jump_to = '#jump-to';
        $(jump_to).attr('data-value', toISOFormat(moment()))
             .change(function() {
                 if (!dateValueChanged(this, 'date')) {
                     return false;
                 }
                 $('.table-container').remove();
                 StatementUI.clearTableContent();
                 initPage();
                 return true;
             });
        DatePicker.init({
            selector: jump_to,
            maxDate : 0,
        });
        if ($(jump_to).attr('data-picker') !== 'native') $(jump_to).val(localize('Today'));
    };

    const onLoad = () => {
        initPage();
        attachDatePicker();
        Slider.viewButtonOnClick('#statement-container');
    };

    const bindStickyHeaderResize = () => {
        $(window).resize(() => {
            if ($('.sticky')) {
                StatementUI.resizeStickyTable();
            }
        });
    };

    const headerSorterBinder = (header) => {
        header.find('.date').on('click', () => {
            orderTableByDate(true);
        });
        header.find('.ref').on('click', () => {
            orderTableByRef(true);
        });
        header.find('.payout').on('click', () => {
            orderTableByPayout(true);
        });
        header.find('.act').on('click', () => {
            orderTableByAction(true);
        });
        header.find('.credit').on('click', () => {
            orderTableByCredit(true);
        });
        header.find('.bal').on('click', () => {
            orderTableByBalance(true);
        });
    };

    const headerPointerCursorAndIcon = (header) => {
        const date = header.find('.date');
        const ref = header.find('.ref');
        const payout = header.find('.payout');
        const act = header.find('.act');
        const credit = header.find('.credit');
        const bal = header.find('.bal');

        date.addClass('pointerCursor');
        ref.addClass('pointerCursor');
        payout.addClass('pointerCursor');
        act.addClass('pointerCursor');
        credit.addClass('pointerCursor');
        bal.addClass('pointerCursor');

        date.html(makeFlexContainerWithSortingIcon(date.html()));
        ref.html(makeFlexContainerWithSortingIcon(ref.html()));
        payout.html(makeFlexContainerWithSortingIcon(payout.html()));
        act.html(makeFlexContainerWithSortingIcon(act.html()));
        credit.html(makeFlexContainerWithSortingIcon(credit.html()));
        bal.html(makeFlexContainerWithSortingIcon(bal.html()));
    };

    const makeFlexContainerWithSortingIcon = (item) => {
        const flexContainer = $('<div>', { class: 'flexContainer' });
        const flexItemName = $('<div>', { class: 'flexItemName' });
        const flexIcon = $('<div>', { class: 'flexIcon' });
        const sortIcon = $('<span>', { class: 'sortIcon' });

        flexItemName.html(item);
        flexIcon.append(sortIcon);
        flexContainer.append(flexItemName);
        flexContainer.append(flexIcon);

        return flexContainer;
    };

    const orderTableByDate = (change) => {
        const descending = ((Number(currentSortingMode === sortingMode.DATE_LONGTIMEAGO) * 2) - 1);
        const ascending = ((Number(currentSortingMode !== sortingMode.DATE_LONGTIMEAGO) * 2) - 1);
        sortTable(ascending,
            descending,
            generateDateComparison(ascending, descending, 'date'),
            change,
            sortingMode.DATE_LONGTIMEAGO,
            sortingMode.DATE_RECENT);
    };

    const orderTableByRef = (change) => {
        const descending = ((Number(currentSortingMode === sortingMode.REF_LEAST) * 2) - 1);
        const ascending = ((Number(currentSortingMode !== sortingMode.REF_LEAST) * 2) - 1);
        sortTable(ascending,
            descending,
            generateNumberComparison(ascending, descending, 'ref'),
            change,
            sortingMode.REF_LEAST,
            sortingMode.REF_MOST);
    };

    const orderTableByPayout = (change) => {
        const descending = ((Number(currentSortingMode !== sortingMode.PAYOUT_MOST) * 2) - 1);
        const ascending = ((Number(currentSortingMode === sortingMode.PAYOUT_MOST) * 2) - 1);
        sortTable(ascending,
            descending,
            generatePayoutComparison(ascending, descending, 'payout'),
            change,
            sortingMode.PAYOUT_MOST,
            sortingMode.PAYOUT_LEAST);
    };

    const orderTableByAction = (change) => {
        const buy = ((Number(currentSortingMode === sortingMode.ACT_BUY) * 2) - 1);
        const sell = ((Number(currentSortingMode !== sortingMode.ACT_BUY) * 2) - 1);
        sortTable(buy,
            sell,
            generateNumberComparison(sell, buy, 'act'),
            change,
            sortingMode.ACT_BUY,
            sortingMode.ACT_SELL);
    };

    const orderTableByCredit = (change) => {
        const losses = ((Number(currentSortingMode !== sortingMode.CREDIT_PROFIT) * 2) - 1);
        const profit = ((Number(currentSortingMode === sortingMode.CREDIT_PROFIT) * 2) - 1);
        sortTable(profit,
            losses,
            generatePriceComparison(profit, losses, 'credit'),
            change,
            sortingMode.CREDIT_PROFIT,
            sortingMode.CREDIT_LOSSES);
    };

    const orderTableByBalance = (change) => {
        const ascending = ((Number(currentSortingMode !== sortingMode.BAL_MOST) * 2) - 1);
        const descending = ((Number(currentSortingMode === sortingMode.BAL_MOST) * 2) - 1);
        sortTable(ascending,
            descending,
            generatePriceComparison(descending, ascending, 'bal'),
            change,
            sortingMode.BAL_MOST,
            sortingMode.BAL_LEAST);
    };

    const sortTable = (ascending, descending, sortingFunction, sortCategoryChange, defaultMode, secondMode) => {
        changeSortMode(sortCategoryChange, defaultMode, secondMode);
        getTableBodyRows();
        getInfoFromRow();
        tableRowsInfo.sort(sortingFunction);
        replaceTableBodyRowsInfo();
        tableRows.splice(0, tableRows.length);
        tableRowsInfo.splice(0, tableRowsInfo.length);
        StatementUI.renewSortMessage(currentSortingMode);
    };

    const generateDateComparison = (ascending, descending, dateName) => (a, b) => {
        const dateFirst = a[dateName].replace(/[-:GMT \n]/g, '');
        const dateSecond = b[dateName].replace(/[-:GMT \n]/g, '');
        if (dateFirst < dateSecond) {
            return descending;
        }
        if (dateFirst > dateSecond) {
            return ascending;
        }
        return 0;
    };

    const generateNumberComparison = (ascending, descending, numberName) => (a, b) => {
        if (a[numberName] < b[numberName]) {
            return descending;
        }
        if (a[numberName] > b[numberName]) {
            return ascending;
        }
        return 0;
    };

    const generatePayoutComparison = (ascending, descending, payoutName) => (a, b) => {
        const aPayNum = Number(a[payoutName].replace(/-/g, ''));
        const bPayNum = Number(b[payoutName].replace(/-/g, ''));

        if (aPayNum < bPayNum) {
            return descending;
        }
        if (aPayNum > bPayNum) {
            return ascending;
        }
        return 0;
    };

    const generatePriceComparison = (ascending, descending, priceName) => (a, b) => {
        const aPrice = Number(a[priceName].replace(/,/g, ''));
        const bPrice = Number(b[priceName].replace(/,/g, ''));
        if (aPrice < bPrice) {
            return descending;
        }
        if (aPrice > bPrice) {
            return ascending;
        }
        return 0;
    };

    const changeSortMode = (sortCategoryChange, defaultMode, secondMode) => {
        if (sortCategoryChange) {
            if (currentSortingMode === defaultMode) {
                currentSortingMode = secondMode;
            } else {
                currentSortingMode = defaultMode;
            }
        }
    };

    const getInfoFromRow = () => {
        for (let i = 0; i < tableRows.length; i++) {
            tableRowsInfo.push(getRowInfoFromTR(tableRows.eq(i)));
        }
    };

    const getTableBody = () => {
        if (tableExist) {
            return $('#statement-table').find('tbody');
        }
        return null;
    };

    const getTableBodyRows = () => {
        tableRows = getTableBody().children('tr');
    };

    const getRowInfoFromTR = (tr) => {
        const row = {
            date  : tr.find('.date').html(),
            ref   : tr.find('.ref').find('span').html(),
            payout: tr.find('.payout').html(),
            act   : tr.find('.act').html(),
            desc  : tr.find('.desc').html(),
            credit: tr.find('.credit').html(),
            bal   : tr.find('.bal').html(),
        };
        if (tr.attr('contract_id') !== undefined) {
            row.contract_id = tr.attr('contract_id');
        }

        if (tr.hasClass('selectedRow')) {
            row.selectedRow = true;
        }

        return row;
    };

    const replaceTableBodyRowsInfo = () => {
        for (let i = 0; i < tableRows.length; i++) {
            const row = tableRows.eq(i);
            if (tableRowsInfo[i].contract_id) {
                row.attr('contract_id', tableRowsInfo[i].contract_id);
            } else {
                row.removeAttr('contract_id');
            }

            if (tableRowsInfo[i].selectedRow) {
                row.addClass('selectedRow');
            } else {
                row.removeClass('selectedRow');
            }

            row.find('.date').html(tableRowsInfo[i].date);
            row.find('.ref').find('span').html(tableRowsInfo[i].ref);
            row.find('.payout').html(tableRowsInfo[i].payout);
            row.find('.act').html(tableRowsInfo[i].act);
            row.find('.desc').html(tableRowsInfo[i].desc);
            row.find('.credit').html(tableRowsInfo[i].credit);
            row.find('.bal').html(tableRowsInfo[i].bal);

            row.find('.credit').removeClass('loss');
            row.find('.credit').removeClass('profit');

            if (tableRowsInfo[i].credit.replace(/,/g, '') >= 0.00) {
                row.find('.credit').removeClass('loss');
                row.find('.credit').addClass('profit');
            } else if (tableRowsInfo[i].credit.replace(/,/g, '') < 0.00) {
                row.find('.credit').addClass('loss');
                row.find('.credit').removeClass('profit');
            }
        }
    };

    const stickyHeaderScrollHandler = () => {
        const firstRow = getTableBody().children('tr').first();
        const lastRow = getTableBody().children('tr').last();

        if (firstRow !== undefined) {
            const firstRowTop = firstRow.offset().top;
            const lastRowBottom = lastRow.offset().top + lastRow.height();
            const documentTopPosition = $(document).scrollTop();
            if (
                documentTopPosition >= firstRowTop &&
                documentTopPosition <= lastRowBottom &&
                !clonedHeader
                ) {
                // clone header and clone statement table and append
                const stickyHeaderContainer = StatementUI.makeStickyTable();
                clonedHeader = StatementUI.cloneStatementTableHeader();
                stickyHeaderContainer.append(clonedHeader);
                $('.table-container').append(stickyHeaderContainer);

                // table width match with the table
                StatementUI.resizeStickyTable();

                // resize the cloned header
                const reference = getTableBody().children('tr').first().children('td');
                StatementUI.resizeStickyTableHeader(reference);

                // bind cloned header with click listener to sorting functions
                headerSorterBinder($('.sticky'));

                // change sticky header scroll left position according to table horizontal scroll on mobile.
                StatementUI.stickyHeaderScrollLeft();

                // binding scroll listener
                $('.table-container').scroll(() => {
                    StatementUI.stickyHeaderScrollLeft();
                });
            } else if (documentTopPosition < firstRowTop ||
                        documentTopPosition > lastRowBottom) {
                // if header is visible or table finishes, destroy cloned header with table
                if (clonedHeader) {
                    $('.sticky').remove();
                    clonedHeader = null;
                    $('.table-container').off('scroll');
                }
            }
        }
    };

    const sortMessageScrollHandler = () => {
        const lastRow = getTableBody().children('tr').last();
        if (lastRow !== undefined) {
            const lastRowBottom = lastRow.offset().top + lastRow.height();
            const documentBottomPosition = $(document).scrollTop() + $(window).height();
            if (documentBottomPosition > lastRowBottom) {
                StatementUI.hideSortMessage();
            } else if (documentBottomPosition <= lastRowBottom) {
                StatementUI.showSortMessage();
            }
        }
    };

    return {
        init            : initPage,
        statementHandler: statementHandler,
        onLoad          : onLoad,
        onUnload        : onUnload,
    };
})();

module.exports = StatementInit;
