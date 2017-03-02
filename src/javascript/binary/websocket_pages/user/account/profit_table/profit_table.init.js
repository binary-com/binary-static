const showLocalTimeOnHover = require('../../../../base/clock').Clock.showLocalTimeOnHover;
const localize             = require('../../../../base/localize').localize;
const Content              = require('../../../../common_functions/content').Content;
const addTooltip           = require('../../../../common_functions/get_app_details').addTooltip;
const buildOauthApps       = require('../../../../common_functions/get_app_details').buildOauthApps;
const ProfitTableUI        = require('./profit_table.ui').ProfitTableUI;
const ProfitTableData      = require('./profit_table.data').ProfitTableData;
const ViewPopupWS          = require('../../view_popup/view_popupws');

const ProfitTableWS = (function() {
    let batchSize,
        chunkSize,
        transactionsReceived,
        transactionsConsumed,
        noMoreData,
        pending,
        currentBatch;

    const tableExist = function() {
        return document.getElementById('profit-table');
    };

    const finishedConsumed = function() {
        return transactionsConsumed === transactionsReceived;
    };

    const onUnload = function() {
        currentBatch = [];
        transactionsConsumed = 0;
        transactionsReceived = 0;
        pending = false;

        ProfitTableUI.errorMessage(null);

        if (tableExist()) {
            ProfitTableUI.cleanTableContent();
        }
    };


    const getNextBatchTransactions = function() {
        ProfitTableData.getProfitTable({ offset: transactionsReceived, limit: batchSize });
        pending = true;
    };

    const getNextChunk = function() {
        const chunk = currentBatch.splice(0, chunkSize);
        transactionsConsumed += chunk.length;
        return chunk;
    };

    const profitTableHandler = function(response) {
        if (response.hasOwnProperty('error')) {
            ProfitTableUI.errorMessage(response.error.message);
            return;
        }

        pending = false;
        const profitTable = response.profit_table;
        currentBatch = profitTable.transactions;
        transactionsReceived += currentBatch.length;

        if (currentBatch.length < batchSize) {
            noMoreData = true;
        }

        if (!tableExist()) {
            ProfitTableUI.createEmptyTable().appendTo('#profit-table-ws-container');
            ProfitTableUI.updateProfitTable(getNextChunk());

            // Show a message when the table is empty
            if ((transactionsReceived === 0) && (currentBatch.length === 0)) {
                $('#profit-table').find('tbody')
                    .append($('<tr/>', { class: 'flex-tr' })
                        .append($('<td/>',  { colspan: 8 })
                            .append($('<p/>', { class: 'notice-msg center-text', text: localize('Your account has no trading activity.') }))));
            }
        }
    };

    const onScrollLoad = function() {
        $(document).scroll(function() {
            const hidableHeight = function(percentage) {
                const totalHidable = $(document).height() - $(window).height();
                return Math.floor((totalHidable * percentage) / 100);
            };

            const pFromTop = $(document).scrollTop();

            if (!tableExist()) {
                return;
            }

            if (pFromTop < hidableHeight(50)) {
                return;
            }

            if (finishedConsumed() && !noMoreData && !pending) {
                getNextBatchTransactions();
                return;
            }

            if (!finishedConsumed()) {
                ProfitTableUI.updateProfitTable(getNextChunk());
            }
        });
    };

    const initSocket = function() {
        BinarySocket.init({
            onmessage: function(msg) {
                const response = JSON.parse(msg.data);

                if (response) {
                    const type = response.msg_type;
                    if (type === 'profit_table') {
                        ProfitTableWS.profitTableHandler(response);
                        showLocalTimeOnHover('td.buy-date,td.sell-date');
                    } else if (type === 'oauth_apps') {
                        addTooltip(ProfitTableUI.setOauthApps(buildOauthApps(response.oauth_apps)));
                    }
                }
            },
        });
        BinarySocket.send({ oauth_apps: 1 });
    };

    const onLoad = function() {
        batchSize = 100;
        chunkSize = batchSize / 2;
        transactionsReceived = 0;
        transactionsConsumed = 0;
        noMoreData = false;
        pending = false;
        currentBatch = [];
        initSocket();
        Content.populate();
        getNextBatchTransactions();
        onScrollLoad();
        ViewPopupWS.viewButtonOnClick('#profit-table-ws-container');
    };

    return {
        profitTableHandler: profitTableHandler,
        onLoad            : onLoad,
        onUnload          : onUnload,
    };
})();

module.exports = ProfitTableWS;
