const moment               = require('moment');
const StatementUI          = require('./statement.ui');
const ViewPopup            = require('../../view_extend/view_extend');
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
        sort_direction = null,
        current_sortType = [];

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
            StatementUI.createEmptyStatementTable().appendTo('#statement-container');
            $('.act, .credit').addClass('nowrap');
            $('.act, .credit, .bal, .payout, .date, .ref').addClass('sortable');
            $('.date').click(function() { sortButton([0, 'date', '.date']); });
            $('.ref').click(function() { sortButton([1, 'number', '.ref']); });
            $('.payout').click(function() { sortButton([2, 'number', '.payout']); });
            $('.act').click(function() { sortButton([3, 'alphabet', '.act']); });
            $('.credit').click(function() { sortButton([5, 'number', '.credit']); });
            $('.bal').click(function() { sortButton([6, 'number', '.bal']); });
            StatementUI.updateStatementTable(getNextChunkStatement());

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
                sortAction(current_sortType);
                liveSearchbox(true);
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
        liveSearchbox(true);
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
        if ($(jump_to).attr('data-picker') !== 'native') { $(jump_to).val(localize('Today')); }
    };

    const liveSearchbox = (nextChunk) => {
        const search_box = '#search-box';
        const noResultbox = '.no-result-box';

        const searchThru = (toSearch) => {
            let count = 0;
            // search through each line of table and search for result, i stands for case-insensitive
            $('table tbody tr').each(function() {
                if ($(this).text().search(new RegExp(toSearch.replace(/\\/g, '\\\\'), 'i')) < 0) {
                    $(this).hide();
                } else {
                    $(this).show();
                    count++;
                }
            });
            // show a message if there is no result
            if (count <= 0 && no_more_data) {
                $('#statement-table').find('tbody')
                    .append($('<tr/>', { class: 'no-result-box' })
                        .append($('<td/>', { colspan: 7 })
                            .append($('<p/>', { class: 'notice-msg center-text', text: localize('No search result found.') }))));
            }
        };

        if (nextChunk === true) {
            const toSearch = $(search_box).val();
            $(noResultbox).remove();
            searchThru(toSearch);
        } else {
            $(search_box).keyup(function() {
                const toSearch = $(this).val();
                $(noResultbox).remove();
                searchThru(toSearch);
            });
        }
    };

    const sortAction = (typeArray) => { // n(number of column), sortType, m(header)
        let i,
            y,
            z;
        const sortTable = tableExist();
        let rows = Array.prototype.slice.call(sortTable.getElementsByTagName('TR'));
        rows.shift();

        function replaceRegex(x) {
            if (typeArray[1] === 'number') {
                x = parseFloat(x.innerText.replace(/,/g, ''));
                if (isNaN(x)) {
                    x = 0;
                }
            } else if (typeArray[1] === 'alphabet') {
                x = x.innerHTML.toLowerCase();
            } else if (typeArray[1] === 'date') {
                x = x.innerHTML.replace(/[-:GMT \n]/g, '');
            }
            return x;
        }

        function mergeSort(arr) {
            const len = arr.length;
            if (len < 2) return arr;
            const mid = Math.floor(len / 2),
                left = arr.slice(0, mid),
                right = arr.slice(mid);

            return merge(mergeSort(left), mergeSort(right));
        }

        function merge(left, right) {
            const result = [],
                lLen = left.length,
                rLen = right.length;
            let l = 0,
                r = 0;
            while (l < lLen && r < rLen) {
                y = replaceRegex(left[l].children[typeArray[0]]);
                z = replaceRegex(right[r].children[typeArray[0]]);
                if (sort_direction === 'ascending') {
                    if (y < z) {
                        result.push(left[l++]);
                    } else {
                        result.push(right[r++]);
                    }
                } else if (sort_direction === 'descending') {
                    if (y > z) {
                        result.push(left[l++]);
                    } else {
                        result.push(right[r++]);
                    }
                }
            }
            return result.concat(left.slice(l)).concat(right.slice(r));
        }

        if (sort_direction !== null) {
            rows = mergeSort(rows);

            for (i = 0; i <= rows.length - 1; i++) {
                $('table tbody tr')[i].outerHTML = rows[i].outerHTML;
            }
        }
    };

    const sortButton = (typeArray) => {
        if (typeArray[2] !== current_sortType[2]) {
            $('.ascending').removeClass('ascending');
            $('.descending').removeClass('descending');
            current_sortType = typeArray;
            sort_direction = null;
        }

        if (sort_direction === null || sort_direction === 'descending') {
            $(typeArray[2]).removeClass('descending');
            $(typeArray[2]).addClass('ascending');
            sort_direction = 'ascending';
            sortAction(current_sortType);
        } else if (sort_direction === 'ascending') {
            $(typeArray[2]).removeClass('ascending');
            $(typeArray[2]).addClass('descending');
            sort_direction = 'descending';
            sortAction(current_sortType);
        }
    };

    const onLoad = () => {
        initPage();
        attachDatePicker();
        liveSearchbox(false);
        ViewPopup.viewButtonOnClick('#statement-container');
    };

    return {
        init            : initPage,
        statementHandler: statementHandler,
        onLoad          : onLoad,
        onUnload        : onUnload,
    };
})();

module.exports = StatementInit;
