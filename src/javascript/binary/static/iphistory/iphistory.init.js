var IPHistory = (function(){
    "use strict";

    //Batch refer to number of data get from ws service per request
    //chunk refer to number of data populate to ui for each append
    //receive means receive from ws service
    //consume means consume by UI and displayed to page

    var batchSize = 50;
    var chunkSize = batchSize/5;

    var noMoreData = true;
    var pending = false;            //serve as a lock to prevent ws request is sequential
    var currentBatch = [];
    var historyReceived = 0;
    var historyConsumed = 0;

    var tableExist = function(){
        return document.getElementById("login-history-table");
    };
    var finishedConsumed = function(){
        return historyConsumed === historyReceived;
    };

    function responseHandler(response){
        if (response.hasOwnProperty('error') && response.error.message) {
          document.getElementById('err').textContent = response.error.message;
          return;
        } else {
          pending = false;

          var login_history = response.login_history;
          currentBatch = login_history;
          historyReceived += currentBatch.length;

          if (!tableExist()) {
              IPHistoryUI.createEmptyTable().appendTo("#login_history-ws-container");
              IPHistoryUI.updateTable(getNextChunk());

              // Show a message when the table is empty
              if ((historyReceived === 0) && (currentBatch.length === 0)) {
                  $('#login-history-table tbody')
                      .append($('<tr/>', {class: "flex-tr"})
                          .append($('<td/>', {colspan: 6})
                              .append($('<p/>', {class: "notice-msg center", text: text.localize("Your account has no Login/Logout activity.")})
                              )
                          )
                      );
              }

              var titleElement = document.getElementById("login_history-title").firstElementChild;
              titleElement.textContent = text.localize(titleElement.textContent);
          }
        }
    }

    function getNextBatch(){
        IPHistoryData.getHistory({limit: 50});
        pending = true;
    }

    function getNextChunk(){
        var chunk = currentBatch.splice(0, chunkSize);
        historyConsumed += chunk.length;
        return chunk;
    }


    function loadChunkWhenScroll(){
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

            /*if (finishedConsumed() && !noMoreData && !pending) {
                getNextBatchStatement();
                return;
            }*/

            if (!finishedConsumed()){
                IPHistoryUI.updateTable(getNextChunk());
            }
        });
    }


    function initTable(){
        pending = false;
        noMoreData = false;

        currentBatch = [];

        historyReceived = 0;
        historyConsumed = 0;

        $("#login_history-ws-container .error-msg").text("");

        IPHistoryUI.clearTableContent();
    }

    function initPage(){
        getNextBatch();
        loadChunkWhenScroll();
    }

    function cleanPageState(){
        initTable();
    }

    return {
        init: initPage,
        responseHandler: responseHandler,
        clean: cleanPageState
    };
}());
