var StatementWS = (function(){
    "use strict";

    var chunkPerLoad = 10;
    var tableCreated = false;

    var shouldNotLoadMore = false;
    var transactionsCurrentDate = [];
    var dataLoaded = false;

    function hideIsLoading() {
        $("#overlay_background").hide();
        $("#loading_in_progress").hide();
    }

    function showIsLoading(){
        $("#overlay_background").show();
        $("#loading_in_progress").show();
    }

    function statementHandler(response){
        if (!tableCreated) {
            StatementUI.createEmptyStatementTable().appendTo("#statement-ws-container");
            $("<div></div>", {
                class: "notice-msg",
                id: "end-of-table",
                text: "End of the table"
            }).appendTo("#statement-ws-container");

            $("#end-of-table").hide();

            tableCreated = true;
        }

        var statement = response.statement;
        transactionsCurrentDate = statement.transactions;
        var top10 = getNextChunkStatement();
        StatementUI.updateStatementTable(top10);

        dataLoaded = true;

        if (top10.length < 10){
            shouldNotLoadMore = true;
            $("#end-of-table").show();
        }

        Content.statementTranslation();
        hideIsLoading();
    }


    function getCurrentSelectedDate() {
        return moment.utc($("#statement-date").val());
    }

    function getStatementForCurrentSelectedDate(){

        var fromDate = getCurrentSelectedDate();
        var tillDate = moment(fromDate);
        tillDate.add(1, "d");

        var fromEpoch = fromDate.unix();
        var tillEpoch = tillDate.unix();

        StatementData.getStatement({date_to: tillEpoch, date_from: fromEpoch});
    }

    function getNextChunkStatement(){
        return transactionsCurrentDate.splice(0, chunkPerLoad);
    }


    function loadStatementChunkWhenScroll(){
        //Attention: attach event to GLOBAL document : BAD!!
        $(document).scroll(function(){

            if (!dataLoaded || shouldNotLoadMore) {
                return;
            }

            function hidableHeight(percentage){
                var totalHidable = $document.height() - $(window).height();
                return Math.floor(totalHidable * percentage / 100);
            }

            var $document = $(document);
            var pFromTop = $document.scrollTop();
            var totalHeight = $document.height();

            if (pFromTop >= hidableHeight(70)) {
                var top10 = getNextChunkStatement();
                StatementUI.updateStatementTable(top10);
                if (top10.length < 10){
                    shouldNotLoadMore = true;
                    $("#end-of-table").show();
                }
            }
        });
    }

    function getStatementOneDayBefore(){
        var oneDayBefore = getCurrentSelectedDate();
        oneDayBefore.subtract(1, "d");

        var oneDayBeforeString = oneDayBefore.locale("en").format("YYYY-MM-DD").toString();

        $("#statement-date").val(oneDayBeforeString);       //set view
        getStatementForCurrentSelectedDate();
    }

    function getStatementOneDayAfter(){
        var oneDayAfter = getCurrentSelectedDate();
        oneDayAfter.add(1,"d");

        var oneDayAfterString = oneDayAfter.locale("en").format("YYYY-MM-DD").toString();

        $("#statement-date").val(oneDayAfterString);      //set view
        getStatementForCurrentSelectedDate();
    }

    function initTable(){
        shouldNotLoadMore = false;
        transactionsCurrentDate = [];
        dataLoaded = false;

        $(".error-msg").text("");
        StatementUI.clearTableContent();

        window.setTimeout(function(){
            if (dataLoaded) {
                return;
            }
            showIsLoading();
            $("#end-of-table").hide();
        }, 500);
    }

    function limitDateSelection(){
        var selectedDate = getCurrentSelectedDate();
        if (selectedDate.isSame(moment.utc(), "day") || selectedDate.isAfter(moment.utc(), "day")) {
            $("#newer-date").hide();
        } else {
            $("#newer-date").show();
        }
    }

    function initPage(){


        StatementUI.setDatePickerDefault(moment.utc());
        StatementUI.showButtonOnDateChange();

        $("#submit-date").click(function(){
            initTable();
            getStatementForCurrentSelectedDate();
            $("#submit-date").addClass("invisible");
            limitDateSelection();
        });
        $("#older-date").click(function(){
            initTable();
            getStatementOneDayBefore();
            limitDateSelection();
        });
        $("#newer-date").click(function(){
            initTable();
            getStatementOneDayAfter();
            limitDateSelection();
        });

        initTable();
        limitDateSelection();
        getStatementForCurrentSelectedDate();
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
