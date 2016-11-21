var showLocalTimeOnHover = require('../../../../base/utility').showLocalTimeOnHover;
var StatementUI = require('./statement.ui').StatementUI;
var addTooltip      = require('../../../../common_functions/get_app_details').addTooltip;
var buildOauthApps  = require('../../../../common_functions/get_app_details').buildOauthApps;
var Content         = require('../../../../common_functions/content').Content;
var japanese_client = require('../../../../common_functions/country_base').japanese_client;
var moment = require('../../../../../lib/moment/moment');

var StatementWS = (function(){
    "use strict";

    //Batch refer to number of data get from ws service per request
    //chunk refer to number of data populate to ui for each append
    //receive means receive from ws service
    //consume means consume by UI and displayed to page

    var batchSize,
        chunkSize,
        noMoreData,
        pending,
        currentBatch,
        transactionsReceived,
        transactionsConsumed;

    var tableExist = function(){
        return document.getElementById("statement-table");
    };

    var finishedConsumed = function(){
        return transactionsConsumed === transactionsReceived;
    };

    function statementHandler(response){
        if(response.hasOwnProperty('error')) {
            StatementUI.errorMessage(response.error.message);
            return;
        }

        pending = false;

        var statement = response.statement;
        currentBatch = statement.transactions;
        transactionsReceived += currentBatch.length;

        if (currentBatch.length < batchSize){
            noMoreData = true;
        }

        if (!tableExist()) {
            StatementUI.createEmptyStatementTable().appendTo("#statement-ws-container");
            $('.act, .credit').addClass('nowrap');
            StatementUI.updateStatementTable(getNextChunkStatement());

            // Show a message when the table is empty
            if ((transactionsReceived === 0) && (currentBatch.length === 0)) {
                $('#statement-table tbody')
                    .append($('<tr/>', {class: "flex-tr"})
                        .append($('<td/>', {colspan: 7})
                            .append($('<p/>', {class: "notice-msg center-text", text: page.text.localize("Your account has no trading activity.")})
                            )
                        )
                    );
            } else {
                $('#jump-to').parent().parent().parent().removeClass('invisible');
                if(page.language().toLowerCase() === 'ja') {
                    $('#download_csv').removeClass('invisible').find('a').unbind('click').click(function(){StatementUI.exportCSV();});
                }
            }
        }
        showLocalTimeOnHover('td.date');
    }

    function getNextBatchStatement(){
        getStatement({offset: transactionsReceived, limit: batchSize});
        pending = true;
    }

    function getNextChunkStatement(){
        var chunk = currentBatch.splice(0, chunkSize);
        transactionsConsumed += chunk.length;
        $('#rows_count').text(transactionsConsumed);
        return chunk;
    }

    function loadStatementChunkWhenScroll(){
        $(document).scroll(function(){

            function hidableHeight(percentage){
                var totalHidable = $(document).height() - $(window).height();
                return Math.floor(totalHidable * percentage / 100);
            }

            var pFromTop = $(document).scrollTop();

            if (!tableExist()){
                return;
            }

            if (pFromTop < hidableHeight(70)) {
                return;
            }

            if (finishedConsumed() && !noMoreData && !pending) {
                getNextBatchStatement();
                return;
            }

            if (!finishedConsumed()){
                StatementUI.updateStatementTable(getNextChunkStatement());
            }
        });
    }

    function initTable(){
        pending = false;
        noMoreData = false;

        currentBatch = [];

        transactionsReceived = 0;
        transactionsConsumed = 0;

        StatementUI.errorMessage(null);

        StatementUI.clearTableContent();
    }

    function initPage() {
        batchSize = 200;
        chunkSize = batchSize/2;
        noMoreData = false;
        pending = false;            //serve as a lock to prevent ws request is sequential
        currentBatch = [];
        transactionsReceived = 0;
        transactionsConsumed = 0;
        initSocket();
        Content.populate();
        getNextBatchStatement();
        loadStatementChunkWhenScroll();
    }

    function cleanStatementPageState(){
        initTable();
    }

    var attachDatePicker = function() {
        $('#jump-to').val(page.text.localize('Today'))
            .datepicker({
                dateFormat: 'yy-mm-dd',
                maxDate   : moment().toDate(),
                onSelect  : function() {
                    $('.table-container').remove();
                    StatementUI.clearTableContent();
                    StatementWS.init();
                }
            });
    };

    function initSocket(){
        BinarySocket.init({
            onmessage: function(msg){
                var response = JSON.parse(msg.data);
                if (response) {
                    var type = response.msg_type;
                    if (type === 'statement'){
                        StatementWS.statementHandler(response);
                    } else if (type === 'oauth_apps') {
                        addTooltip(StatementUI.setOauthApps(buildOauthApps(response.oauth_apps)));
                    }
                }
            }
        });
        BinarySocket.send({'oauth_apps': 1});
    }

    function getStatement(opts){
        var req = {statement: 1, description: 1};
        if(opts){
            $.extend(true, req, opts);
        }
        var jump_to = $('#jump-to').val();
        if (jump_to !== '' && jump_to !== page.text.localize('Today')) {
            req.date_to = Math.floor((moment.utc(jump_to).valueOf() / 1000)) +
                          ((japanese_client() ? 15 : 24) * (60*60));
            req.date_from = 0;
        }

        BinarySocket.send(req);
    }

    return {
        init: initPage,
        statementHandler: statementHandler,
        clean: cleanStatementPageState,
        attachDatePicker: attachDatePicker,
    };
}());

module.exports = {
    StatementWS: StatementWS,
};
