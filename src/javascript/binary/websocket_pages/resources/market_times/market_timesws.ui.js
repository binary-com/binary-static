var showLoadingImage       = require('../../../base/utility').showLoadingImage;
var Table                  = require('../../../common_functions/attach_dom/table').Table;
var jqueryuiTabsToDropdown = require('../../../common_functions/common_functions').jqueryuiTabsToDropdown;
var Content                = require('../../../common_functions/content').Content;
var japanese_client        = require('../../../common_functions/country_base').japanese_client;
var MarketTimesData        = require('./market_timesws.data').MarketTimesData;
var MarketTimes            = require('../market_timesws').MarketTimes;
var moment                 = require('moment');
var State                  = require('../../../base/storage').State;
var DatePicker             = require('../../../components/date_picker').DatePicker;
var toReadableFormat       = require('../../../common_functions/string_util').toReadableFormat;
var toISOFormat            = require('../../../common_functions/string_util').toISOFormat;
var dateValueChanged       = require('../../../common_functions/common_functions').dateValueChanged;

var MarketTimesUI = (function() {
    "use strict";

    var $date,
        $container;
    var columns,
        activeSymbols,
        tradingTimes,
        isFramed;

    var init = function(config) {
        $date      = $('#trading-date');
        $container = $('#trading-times');
        columns    = ['Asset', 'Opens', 'Closes', 'Settles', 'UpcomingEvents'];
        activeSymbols = tradingTimes = undefined;

        if ($container.contents().length) return;

        Content.populate();
        showLoadingImage($container);

        isFramed = (config && config.framed);
        if (!tradingTimes) {
            initSocket();
            MarketTimesData.sendRequest('today', !activeSymbols);
        }

        var date = moment.utc();
        $date.val(toReadableFormat(date))
             .attr('data-value', toISOFormat(date));
        var datePickerInst = new DatePicker('#trading-date');
        datePickerInst.show('today', 364);
        $date.change(function() {
            if (!dateValueChanged(this, 'date')) {
                return false;
            }
            $container.empty();
            showLoadingImage($container);
            tradingTimes = null;
            MarketTimesData.sendRequest($date.attr('data-value'), !activeSymbols);
        });

        $container.tabs();
    };

    var populateTable = function() {
        if(!activeSymbols || !tradingTimes) return;

        $('#errorMsg').addClass('hidden');

        var isJapanTrading = japanese_client();

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
            .append($('<div/>', {class: 'gr-padding-10'}))
            .append($contents.children());

        $container.tabs('destroy').tabs();

        if (isFramed) {
            $container.find('ul').hide();
            $('<div/>', {class: 'center-text'}).append(jqueryuiTabsToDropdown($container)).prependTo($container);
        }
    };

    var createMarketTables = function(market, isJapanTrading) {
        var $marketTables = $('<div/>');

        // submarkets of this market
        var submarkets = market.submarkets;
        for(var s = 0; s < submarkets.length; s++) {
            // display only "Major Pairs" for Japan
            if(isJapanTrading) {
                var submarketInfo = MarketTimes.getSubmarketInfo(activeSymbols, submarkets[s].name);
                if(submarketInfo.length === 0 || submarketInfo[0].submarket !== 'major_pairs') {
                    continue;
                }
            }

            // submarket table
            var $submarketTable = createEmptyTable(market.name + '-' + s);

            // submarket name
            $submarketTable.find('thead').prepend(createSubmarketHeader(submarkets[s].name))
                           .find('th.opens, th.closes').addClass('nowrap');

            // symbols of this submarket
            var symbols = submarkets[s].symbols;
            for(var sy = 0; sy < symbols.length; sy++) {
                if (Object.keys(MarketTimes.getSymbolInfo(symbols[sy].symbol, activeSymbols)).length === 0) continue;
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
            result += (i > 0 ? '<br />' : '') + page.text.localize(events[i].descrip) + ': ' + page.text.localize(events[i].dates);
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

    var initSocket = function() {
        if (State.get('is_beta_trading')) return;
        BinarySocket.init({
            onmessage: function(msg) {
                var response = JSON.parse(msg.data);
                if (response) {
                    responseHandler(response);
                }
            }
        });
    };

    var responseHandler = function(response) {
        var msg_type = response.msg_type;
        if (msg_type === "trading_times") {
            MarketTimesUI.setTradingTimes(response);
        }
        else if (msg_type === "active_symbols") {
            MarketTimesUI.setActiveSymbols(response);
        }
    };

    return {
        init: init,
        setActiveSymbols: function(response) {
            activeSymbols = response.active_symbols;
            if(tradingTimes) populateTable();
        },
        setTradingTimes: function(response) {
            tradingTimes = response.trading_times;
            if(activeSymbols) populateTable();
        }
    };
}());

module.exports = {
    MarketTimesUI: MarketTimesUI,
};
