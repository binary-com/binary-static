const showLocalTimeOnHover = require('../../../../base/clock').Clock.showLocalTimeOnHover;
const StatementUI          = require('./statement.ui').StatementUI;
const addTooltip           = require('../../../../common_functions/get_app_details').addTooltip;
const buildOauthApps       = require('../../../../common_functions/get_app_details').buildOauthApps;
const Content              = require('../../../../common_functions/content').Content;
const japanese_client      = require('../../../../common_functions/country_base').japanese_client;
const moment               = require('moment');
const DatePicker           = require('../../../../components/date_picker').DatePicker;
const toISOFormat          = require('../../../../common_functions/string_util').toISOFormat;
const dateValueChanged     = require('../../../../common_functions/common_functions').dateValueChanged;
const localize    = require('../../../../base/localize').localize;
const getLanguage = require('../../../../base/language').getLanguage;

const StatementWS = (function() {
    'use strict';

    // Batch refer to number of data get from ws service per request
    // chunk refer to number of data populate to ui for each append
    // receive means receive from ws service
    // consume means consume by UI and displayed to page

    let batchSize,
        chunkSize,
        noMoreData,
        pending,
        currentBatch,
        transactionsReceived,
        transactionsConsumed;

    const tableExist = function() {
        return document.getElementById('statement-table');
    };

    const finishedConsumed = function() {
        return transactionsConsumed === transactionsReceived;
    };

    const getStatement = function(opts) {
        const req = { statement: 1, description: 1 };
        if (opts) {
            $.extend(true, req, opts);
        }
        const jumpToVal = $('#jump-to').attr('data-value');
        if (jumpToVal && jumpToVal !== '') {
            req.date_to = moment.utc(jumpToVal).unix() + ((japanese_client() ? 15 : 24) * (60 * 60));
            req.date_from = 0;
        }
        BinarySocket.send(req);
    };

    const getNextBatchStatement = function() {
        getStatement({ offset: transactionsReceived, limit: batchSize });
        pending = true;
    };

    const getNextChunkStatement = function() {
        const chunk = currentBatch.splice(0, chunkSize);
        transactionsConsumed += chunk.length;
        $('#rows_count').text(transactionsConsumed);
        return chunk;
    };

    const statementHandler = function(response) {
        if (response.hasOwnProperty('error')) {
            StatementUI.errorMessage(response.error.message);
            return;
        }

        pending = false;

        const statement = response.statement;
        currentBatch = statement.transactions;
        transactionsReceived += currentBatch.length;

        if (currentBatch.length < batchSize) {
            noMoreData = true;
        }

        if (!tableExist()) {
            StatementUI.createEmptyStatementTable().appendTo('#statement-ws-container');
            $('.act, .credit').addClass('nowrap');
            StatementUI.updateStatementTable(getNextChunkStatement());

            // Show a message when the table is empty
            if ((transactionsReceived === 0) && (currentBatch.length === 0)) {
                $('#statement-table').find('tbody')
                    .append($('<tr/>', { class: 'flex-tr' })
                        .append($('<td/>', { colspan: 7 })
                            .append($('<p/>', { class: 'notice-msg center-text', text: localize('Your account has no trading activity.') }))));
            } else {
                $('#jump-to').parent().parent().parent()
                             .removeClass('invisible');
                if (getLanguage() === 'JA') {
                    $('#download_csv').removeClass('invisible')
                                      .find('a')
                                      .unbind('click')
                                      .click(function() { StatementUI.exportCSV(); });
                }
            }
        }
        showLocalTimeOnHover('td.date');
    };

    const loadStatementChunkWhenScroll = function() {
        $(document).scroll(function() {
            const hidableHeight = function(percentage) {
                const totalHidable = $(document).height() - $(window).height();
                return Math.floor((totalHidable * percentage) / 100);
            };

            const pFromTop = $(document).scrollTop();

            if (!tableExist()) {
                return;
            }

            if (pFromTop < hidableHeight(70)) {
                return;
            }

            if (finishedConsumed() && !noMoreData && !pending) {
                getNextBatchStatement();
                return;
            }

            if (!finishedConsumed()) {
                StatementUI.updateStatementTable(getNextChunkStatement());
            }
        });
    };

    const initTable = function() {
        pending = false;
        noMoreData = false;

        currentBatch = [];

        transactionsReceived = 0;
        transactionsConsumed = 0;

        StatementUI.errorMessage(null);

        StatementUI.clearTableContent();
    };

    const initSocket = function() {
        BinarySocket.init({
            onmessage: function(msg) {
                const response = JSON.parse(msg.data);
                if (response) {
                    const type = response.msg_type;
                    if (type === 'statement') {
                        StatementWS.statementHandler(response);
                    } else if (type === 'oauth_apps') {
                        addTooltip(StatementUI.setOauthApps(buildOauthApps(response.oauth_apps)));
                    }
                }
            },
        });
        BinarySocket.send({ oauth_apps: 1 });
    };

    const initPage = function() {
        batchSize = 200;
        chunkSize = batchSize / 2;
        noMoreData = false;
        pending = false;            // serve as a lock to prevent ws request is sequential
        currentBatch = [];
        transactionsReceived = 0;
        transactionsConsumed = 0;
        initSocket();
        Content.populate();
        getNextBatchStatement();
        loadStatementChunkWhenScroll();
    };

    const cleanStatementPageState = function() {
        initTable();
    };

    const attachDatePicker = function() {
        const jumpTo = '#jump-to',
            datePickerInst = new DatePicker(jumpTo);
        datePickerInst.hide();
        datePickerInst.show({ maxDate: 0 });
        $(jumpTo).val(localize('Today'))
                 .attr('data-value', toISOFormat(moment()))
                 .change(function() {
                     if (!dateValueChanged(this, 'date')) {
                         return false;
                     }
                     $('.table-container').remove();
                     StatementUI.clearTableContent();
                     StatementWS.init();
                     return true;
                 });
    };

    return {
        init            : initPage,
        statementHandler: statementHandler,
        clean           : cleanStatementPageState,
        attachDatePicker: attachDatePicker,
    };
})();

module.exports = {
    StatementWS: StatementWS,
};
