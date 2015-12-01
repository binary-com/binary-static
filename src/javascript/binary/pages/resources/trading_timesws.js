var TradingTimesWS = (function() {
    "use strict";

    var $date      = $('#trading-date');
    var $container = $('#trading-times');
    var columns    = ['Asset', 'Opens', 'Closes', 'Settles', 'UpcomingEvents'];


    var init = function() {
        showLoadingImage($container);
        sendRequest('today');

        $date.val(moment.utc(new Date()).format('YYYY-MM-DD'));
        $date.datepicker({minDate: 0, maxDate: '+1y', dateFormat: 'yy-mm-dd', autoSize: true});
        $date.change(function() {
            $container.empty();
            showLoadingImage($container);
            sendRequest();
        });
    };

    var sendRequest = function(date) {
        BinarySocket.send({"trading_times": (date ? date : $date.val())});
    };

    var populateTable = function(response) {
        $('#errorMsg').addClass('hidden');

        var markets = response.trading_times.markets;

        var $ul = $('<ul/>');
        var $contents = $('<div/>');

        for(var m = 0; m < markets.length; m++) {
            var tabID = 'tradingtimes-' + markets[m].name.toLowerCase();

            // tabs
            $ul.append($('<li/>', {class: 'ja-hide'}).append($('<a/>', {href: '#' + tabID, text: markets[m].name, id: 'outline'})));

            // contents
            var $market = $('<div/>', {id: tabID});
            $market.append(createMarketTables(markets[m]));
            $contents.append($market);
        }

        $container
            .empty()
            .append($ul)
            .append($('<div/>', {class: 'grd-row-padding'}))
            .append($contents.children());

        $container.tabs('destroy').tabs();
    };

    var createMarketTables = function(market) {
        var $marketTables = $('<div/>');

        // submarkets of this market
        var submarkets = market.submarkets;
        for(var s = 0; s < submarkets.length; s++) {
            // just show "Major Pairs" when the language is JA
            if(page.language().toLowerCase() === 'ja' && submarkets[s].name !== '主要ペア'){
                continue;
            }

            // submarket table
            var $submarketTable = createEmptyTable(market.name + '-' + s);

            // submarket name
            $submarketTable.find('thead').prepend(createSubmarketHeader(submarkets[s].name));

            // symbols of this submarket
            var symbols = submarkets[s].symbols;
            for(var sy = 0; sy < symbols.length; sy++) {
                $submarketTable.find('tbody').append(createSubmarketTableRow(market.name, submarkets[s].name, symbols[sy]));
            }

            $marketTables.append($submarketTable);
        }

        return $marketTables;
    };

    var createSubmarketHeader = function(submarketName) {
        return $('<tr/>', {class: 'flex-tr'})
            .append($('<th/>', {class: 'flex-tr-child submarket-name', colspan: columns.length, text: submarketName}));
    };

    var createSubmarketTableRow = function(marketName, submarketName, symbol) {
        var $tableRow = Table.createFlexTableRow(
            [
                symbol.name,
                '', // Opens
                '', // Closes
                symbol.times.settlement,
                ''  // UpcomingEvents
            ], 
            columns, 
            "data"
        );

        $tableRow.children('.opens').html(symbol.times.open.join('<br />'));
        $tableRow.children('.closes').html(symbol.times.close.join('<br />'));
        $tableRow.children('.upcomingevents').html(createEventsText(symbol.events));

        return $tableRow;
    };

    var createEventsText = function(events) {
        var result = '';
        for(var i = 0; i < events.length; i++) {
            result += (i > 0 ? '<br />' : '') + events[i].descrip + ': ' + events[i].dates;
        }
        return result;
    };

    var createEmptyTable = function(tableID) {
        var header = [
            Content.localize().textAsset,
            Content.localize().textOpens,
            Content.localize().textCloses,
            Content.localize().textSettles,
            Content.localize().textUpcomingEvents
        ];

        var metadata = {
            id: tableID,
            cols: columns
        };

        return Table.createFlexTable([], metadata, header);
    };


    return {
        init: init,
        populateTable: populateTable
    };
}());



pjax_config_page("resources/trading_timesws", function() {
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg) {
                    var response = JSON.parse(msg.data);
                    if (response) {
                        if (response.msg_type === "trading_times") {
                            TradingTimesWS.populateTable(response);
                        }
                    }
                }
            });

            Content.populate();
            TradingTimesWS.init();
        }
    };
});
