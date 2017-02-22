const showLoadingImage       = require('../../../base/utility').showLoadingImage;
const Table                  = require('../../../common_functions/attach_dom/table').Table;
const jqueryuiTabsToDropdown = require('../../../common_functions/common_functions').jqueryuiTabsToDropdown;
const Content                = require('../../../common_functions/content').Content;
const japanese_client        = require('../../../common_functions/country_base').japanese_client;
const MarketTimesData        = require('./market_timesws.data').MarketTimesData;
const MarketTimes            = require('../market_timesws').MarketTimes;
const moment                 = require('moment');
const State                  = require('../../../base/storage').State;
const DatePicker             = require('../../../components/date_picker').DatePicker;
const toReadableFormat       = require('../../../common_functions/string_util').toReadableFormat;
const toISOFormat            = require('../../../common_functions/string_util').toISOFormat;
const dateValueChanged       = require('../../../common_functions/common_functions').dateValueChanged;
const localize = require('../../../base/localize').localize;

const MarketTimesUI = (function() {
    'use strict';

    let $date,
        $container,
        columns,
        activeSymbols,
        tradingTimes,
        isFramed;

    const onLoad = function(config) {
        $date      = $('#trading-date');
        $container = $('#trading-times');
        columns    = ['Asset', 'Opens', 'Closes', 'Settles', 'UpcomingEvents'];
        if (!State.get('is_beta_trading')) activeSymbols = tradingTimes = undefined;

        if ($container.contents().length) return;

        Content.populate();
        showLoadingImage($container);

        isFramed = (config && config.framed);
        if (!tradingTimes) {
            initSocket();
            MarketTimesData.sendRequest('today', !(activeSymbols && activeSymbols.length));
        }

        const date = moment.utc();
        $date.val(toReadableFormat(date))
             .attr('data-value', toISOFormat(date));
        const datePickerInst = new DatePicker('#trading-date');
        datePickerInst.show('today', 364);
        $date.change(function() {
            if (!dateValueChanged(this, 'date')) {
                return false;
            }
            $container.empty();
            showLoadingImage($container);
            tradingTimes = null;
            MarketTimesData.sendRequest($date.attr('data-value'), !activeSymbols);
            return true;
        });

        $container.tabs();
    };

    const populateTable = function() {
        if (!activeSymbols || !tradingTimes) return;

        $('#errorMsg').addClass('hidden');

        const isJapanTrading = japanese_client();

        const markets = tradingTimes.markets;

        const $ul = $('<ul/>', { class: isJapanTrading ? 'hidden' : '' });
        const $contents = $('<div/>');

        for (let m = 0; m < markets.length; m++) {
            const tabID = 'market_' + (m + 1);

            // tabs
            if (!isJapanTrading) {
                $ul.append($('<li/>').append($('<a/>', { href: '#' + tabID, text: markets[m].name, id: 'outline' })));
            }

            // contents
            const $market = $('<div/>', { id: tabID });
            $market.append(createMarketTables(markets[m], isJapanTrading));
            $contents.append($market);
        }

        $container.empty().append($ul).append($contents.children());

        $container.tabs('destroy').tabs();

        if (isFramed) {
            $container.find('ul').hide();
            $('<div/>', { class: 'center-text' }).append(jqueryuiTabsToDropdown($container)).prependTo($container);
        }
    };

    const createMarketTables = function(market, isJapanTrading) {
        const $marketTables = $('<div/>');

        // submarkets of this market
        const submarkets = market.submarkets;
        let shouldPopulate;
        for (let s = 0; s < submarkets.length; s++) {
            shouldPopulate = true;
            // display only "Major Pairs" for Japan
            if (isJapanTrading) {
                const submarketInfo = MarketTimes.getSubmarketInfo(activeSymbols, submarkets[s].name);
                if (submarketInfo.length === 0 || submarketInfo[0].submarket !== 'major_pairs') {
                    shouldPopulate = false;
                }
            }

            if (shouldPopulate) {
                // submarket table
                const $submarketTable = createEmptyTable(market.name + '-' + s);

                // submarket name
                $submarketTable.find('thead').prepend(createSubmarketHeader(submarkets[s].name))
                    .find('th.opens, th.closes').addClass('nowrap');

                // symbols of this submarket
                const symbols = submarkets[s].symbols;
                for (let sy = 0; sy < symbols.length; sy++) {
                    if (Object.keys(MarketTimes.getSymbolInfo(symbols[sy].symbol, activeSymbols)).length !== 0) {
                        $submarketTable.find('tbody').append(createSubmarketTableRow(market.name, submarkets[s].name, symbols[sy]));
                    }
                }

                $marketTables.append($submarketTable);
            }
        }

        return $marketTables;
    };

    const createSubmarketHeader = function(submarketName) {
        return $('<tr/>', { class: 'flex-tr' })
            .append($('<th/>', { class: 'flex-tr-child submarket-name', colspan: columns.length, text: submarketName }));
    };

    const createSubmarketTableRow = function(marketName, submarketName, symbol) {
        const $tableRow = Table.createFlexTableRow(
            [
                symbol.name,
                '', // Opens
                '', // Closes
                symbol.times.settlement,
                '',  // UpcomingEvents
            ],
            columns,
            'data');
        $tableRow.children('.opens').html(symbol.times.open.join('<br />'));
        $tableRow.children('.closes').html(symbol.times.close.join('<br />'));
        $tableRow.children('.upcomingevents').html(createEventsText(symbol.events));

        return $tableRow;
    };

    const createEventsText = function(events) {
        let result = '';
        for (let i = 0; i < events.length; i++) {
            result += (i > 0 ? '<br />' : '') + localize(events[i].descrip) + ': ' + localize(events[i].dates);
        }
        return result.length > 0 ? result : '--';
    };

    const createEmptyTable = function(tableID) {
        const header = [
            localize('Asset'),
            localize('Opens'),
            localize('Closes'),
            localize('Settles'),
            localize('Upcoming Events'),
        ];

        const metadata = {
            id  : tableID,
            cols: columns,
        };

        return Table.createFlexTable([], metadata, header);
    };

    const initSocket = function() {
        if (State.get('is_beta_trading')) return;
        BinarySocket.init({
            onmessage: function(msg) {
                const response = JSON.parse(msg.data);
                if (response) {
                    responseHandler(response);
                }
            },
        });
    };

    const responseHandler = function(response) {
        const msg_type = response.msg_type;
        if (msg_type === 'trading_times') {
            MarketTimesUI.setTradingTimes(response);
        } else if (msg_type === 'active_symbols') {
            MarketTimesUI.setActiveSymbols(response);
        }
    };

    return {
        onLoad          : onLoad,
        setActiveSymbols: function(response) {
            activeSymbols = response.active_symbols.slice(0); // clone
            if (tradingTimes) populateTable();
        },
        setTradingTimes: function(response) {
            tradingTimes = response.trading_times;
            if (activeSymbols) populateTable();
        },
    };
})();

module.exports = MarketTimesUI;
