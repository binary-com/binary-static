var showLocalTimeOnHover = require('../../../../base/utility').showLocalTimeOnHover;
var addTooltip           = require('../../../../common_functions/get_app_details').addTooltip;
var buildOauthApps       = require('../../../../common_functions/get_app_details').buildOauthApps;
var Content              = require('../../../../common_functions/content').Content;
var ProfitTableUI        = require('./profit_table.ui').ProfitTableUI;
var ProfitTableData      = require('./profit_table.data').ProfitTableData;
var localize = require('../../../../base/localize').localize;

var ProfitTableWS = (function() {
    var batchSize,
        chunkSize,
        transactionsReceived,
        transactionsConsumed,
        noMoreData,
        pending,
        currentBatch;

    var tableExist = function() {
        return document.getElementById('profit-table');
    };

    var finishedConsumed = function() {
        return transactionsConsumed === transactionsReceived;
    };

    function initTable() {
        currentBatch = [];
        transactionsConsumed = 0;
        transactionsReceived = 0;
        pending = false;

        ProfitTableUI.errorMessage(null);

        if (tableExist()) {
            ProfitTableUI.cleanTableContent();
        }
    }

    function profitTableHandler(response) {
        if (response.hasOwnProperty('error')) {
            ProfitTableUI.errorMessage(response.error.message);
            return;
        }

        pending = false;
        var profitTable = response.profit_table;
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
                $('#profit-table tbody')
                    .append($('<tr/>', { class: 'flex-tr' })
                        .append($('<td/>',  { colspan: 8 })
                            .append($('<p/>', { class: 'notice-msg center-text', text: localize('Your account has no trading activity.') }))));
            }
        }
    }

    function getNextBatchTransactions() {
        ProfitTableData.getProfitTable({ offset: transactionsReceived, limit: batchSize });
        pending = true;
    }

    function getNextChunk() {
        var chunk = currentBatch.splice(0, chunkSize);
        transactionsConsumed += chunk.length;
        return chunk;
    }

    function onScrollLoad() {
        $(document).scroll(function() {
            function hidableHeight(percentage) {
                var totalHidable = $(document).height() - $(window).height();
                return Math.floor((totalHidable * percentage) / 100);
            }

            var pFromTop = $(document).scrollTop();

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
    }

    function init() {
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
    }

    function initSocket() {
        BinarySocket.init({
            onmessage: function(msg) {
                var response = JSON.parse(msg.data);

                if (response) {
                    var type = response.msg_type;
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
    }

    return {
        profitTableHandler: profitTableHandler,
        init              : init,
        clean             : initTable,
    };
})();

module.exports = {
    ProfitTableWS: ProfitTableWS,
};
