var MarketTimesWS = (function() {
    "use strict";

    var $date,
        $container;

    var columns,
        activeSymbols, 
        tradingTimes;


    var init = function() {
        $date      = $('#trading-date');
        $container = $('#trading-times');
        columns    = ['Asset', 'Opens', 'Closes', 'Settles', 'UpcomingEvents'];
        activeSymbols = null;
        tradingTimes = null;
        showLoadingImage($container);
        BinarySocket.send({"active_symbols": "brief"});
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
        tradingTimes = null;
        BinarySocket.send({"trading_times": (date ? date : $date.val())});
    };

    var getActiveSymbols = function(response) {
        activeSymbols = response.active_symbols;
        if(tradingTimes) {
            populateTable();
        }
    };

    var getTradingTimes = function(response) {
        tradingTimes = response.trading_times;
        if(activeSymbols) {
            populateTable();
        }
    };

    var populateTable = function() {
        $('#errorMsg').addClass('hidden');

        var isJapanTrading = page.language().toLowerCase() === 'ja';

        var markets = tradingTimes.markets;

        var $ul = $('<ul/>', {class: isJapanTrading ? 'hidden' : ''});
        var $contents = $('<div/>');

        for(var m = 0; m < markets.length; m++) {
            var tabID = 'market_' + (m + 1);

            // tabs
            if(!isJapanTrading) {
                $ul.append($('<li/>').append($('<a/>', {href: '#' + tabID, text: markets[m].name, id: 'outline'})));
            }

            // contents
            var $market = $('<div/>', {id: tabID});
            $market.append(createMarketTables(markets[m], isJapanTrading));
            $contents.append($market);
        }

        $container
            .empty()
            .append($ul)
            .append($('<div/>', {class: 'grd-row-padding'}))
            .append($contents.children());

        $container.tabs('destroy').tabs();
    };

    var createMarketTables = function(market, isJapanTrading) {
        var $marketTables = $('<div/>');

        // submarkets of this market
        var submarkets = market.submarkets;
        for(var s = 0; s < submarkets.length; s++) {
            // just show "Major Pairs" when the language is JA
            if(isJapanTrading) {
                var symbolInfo = symbolSearch(submarkets[s].name);
                if(symbolInfo.length > 0 && symbolInfo[0].submarket !== 'major_pairs') {
                    continue;
                }
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

    var symbolSearch = function(submarketname) {
        return activeSymbols.filter(function(sy) {
            return sy.submarket_display_name === submarketname;
        });
    };

    var createEventsText = function(events) {
        var result = '';
        for(var i = 0; i < events.length; i++) {
            result += (i > 0 ? '<br />' : '') + events[i].descrip + ': ' + events[i].dates;
        }
        return result.length > 0 ? result : '--';
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
        getTradingTimes : getTradingTimes,
        getActiveSymbols: getActiveSymbols
    };
}());



pjax_config_page("market_timesws", function() {
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg) {
                    var response = JSON.parse(msg.data);
                    if (response) {
                        if (response.msg_type === "trading_times") {
                            MarketTimesWS.getTradingTimes(response);
                        }
                        else if (response.msg_type === "active_symbols") {
                            MarketTimesWS.getActiveSymbols(response);
                        }
                    }
                }
            });

            Content.populate();
            MarketTimesWS.init();
        }
    };
});
