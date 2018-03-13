const StatementUI          = require('./statement.ui');
const ViewPopup            = require('../../view_popup/view_popup');
const showLocalTimeOnHover = require('../../../../base/clock').showLocalTimeOnHover;
const BinarySocket         = require('../../../../base/socket');
const DateTo               = require('../../../../common/attach_dom/date_to');
const addTooltip           = require('../../../../common/get_app_details').addTooltip;
const buildOauthApps       = require('../../../../common/get_app_details').buildOauthApps;
const jpResidence          = require('../../../../common/country_base').jpResidence;
const getLanguage          = require('../../../../../_common/language').get;
const localize             = require('../../../../../_common/localize').localize;

const StatementInit = (() => {
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
        transactions_consumed;

    const tableExist = () => document.getElementById('statement-table');

    const finishedConsumed = () => (transactions_consumed === transactions_received);

    const getStatement = (opts) => {
        const req = { statement: 1, description: 1 };

        if (opts) $.extend(true, req, opts);

        const obj_date_to_from = DateTo.getDateToFrom();
        if (obj_date_to_from) $.extend(true, req, obj_date_to_from);

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
        current_batch   = statement.transactions;
        transactions_received += current_batch.length;

        if (current_batch.length < batch_size) {
            no_more_data = true;
        }

        if (!tableExist()) {
            StatementUI.createEmptyStatementTable().appendTo('#statement-container');
            $('.act, .credit').addClass('nowrap');
            StatementUI.updateStatementTable(getNextChunkStatement());

            // Show a message when the table is empty
            if (transactions_received === 0 && current_batch.length === 0) {
                $('#statement-table').find('tbody')
                    .append($('<tr/>', { class: 'flex-tr' })
                        .append($('<td/>', { colspan: 7 })
                            .append($('<p/>', { class: 'notice-msg center-text', text: localize('Your account has no trading activity.') }))));
            } else {
                $('#util_row').setVisibility(1);
                if (getLanguage() === 'JA' && jpResidence()) {
                    $('#download_csv')
                        .setVisibility(1)
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

            if (!finishedConsumed()) StatementUI.updateStatementTable(getNextChunkStatement());
        });
    };

    const onUnload = () => {
        pending      = false;
        no_more_data = false;

        current_batch = [];

        transactions_received = 0;
        transactions_consumed = 0;

        StatementUI.errorMessage(null);
        StatementUI.clearTableContent();
    };

    const initPage = () => {
        batch_size            = 200;
        chunk_size            = batch_size / 2;
        no_more_data          = false;
        pending               = false;            // serve as a lock to prevent ws request is sequential
        current_batch         = [];
        transactions_received = 0;
        transactions_consumed = 0;

        BinarySocket.send({ oauth_apps: 1 }).then((response) => {
            addTooltip(StatementUI.setOauthApps(buildOauthApps(response)));
            $('.barspinner').setVisibility(0);
        });
        getNextBatchStatement();
        loadStatementChunkWhenScroll();
    };

    const onLoad = () => {
        initPage();
        DateTo.attachDateToPicker(() => {
            StatementUI.clearTableContent();
            initPage();
        });
        ViewPopup.viewButtonOnClick('#statement-container');
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = StatementInit;
