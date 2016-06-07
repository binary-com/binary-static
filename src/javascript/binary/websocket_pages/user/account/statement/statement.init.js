var StatementWS = (function(){
    "use strict";

    //Batch refer to number of data get from ws service per request
    //chunk refer to number of data populate to ui for each append
    //receive means receive from ws service
    //consume means consume by UI and displayed to page

    var batchSize = 100;
    var chunkSize = batchSize/2;

    var noMoreData = false;
    var pending = false;            //serve as a lock to prevent ws request is sequential
    var currentBatch = [];
    var transactionsReceived = 0;
    var transactionsConsumed = 0;

    var tableExist = function(){
        return document.getElementById("statement-table");
    };
    var finishedConsumed = function(){
        return transactionsConsumed === transactionsReceived;
    };

    function statementHandler(response){
        pending = false;

        var statement = response.statement;
        currentBatch = statement.transactions;
        transactionsReceived += currentBatch.length;

        if (currentBatch.length < batchSize){
            noMoreData = true;
        }

        if (!tableExist()) {
            StatementUI.createEmptyStatementTable().appendTo("#statement-ws-container");
            StatementUI.updateStatementTable(getNextChunkStatement());

            // Show a message when the table is empty
            if ((transactionsReceived === 0) && (currentBatch.length === 0)) {
                $('#statement-table tbody')
                    .append($('<tr/>', {class: "flex-tr"})
                        .append($('<td/>', {colspan: 7})
                            .append($('<p/>', {class: "notice-msg center", text: text.localize("Your account has no trading activity.")})
                            )
                        )
                    );
            }

            Content.statementTranslation();
        }
    }

    function getNextBatchStatement(){
        StatementData.getStatement({offset: transactionsReceived, limit: batchSize});
        pending = true;
    }

    function getNextChunkStatement(){
        var chunk = currentBatch.splice(0, chunkSize);
        transactionsConsumed += chunk.length;
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

        $(".error-msg").text("");

        StatementUI.clearTableContent();
    }

    function initPage(){
        getNextBatchStatement();
        loadStatementChunkWhenScroll();
    }

    function cleanStatementPageState(){
        initTable();
    }

    return {
        init: initPage,
        statementHandler: statementHandler,
        clean: cleanStatementPageState
    };
}());
