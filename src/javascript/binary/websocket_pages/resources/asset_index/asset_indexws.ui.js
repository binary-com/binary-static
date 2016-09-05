var AssetIndexUI = (function() {
    "use strict";

    var $container,
        $tabs,
        $contents;
    var activeSymbols,
        assetIndex,
        marketColumns,
        isFramed;

    var init = function(config) {
        if (japanese_client()) {
            if (!TradePage_Beta.is_trading_page()) {
                window.location.href = page.url.url_for('resources');
            }
            return;
        }

        $container = $('#asset-index');
        if ($container.contents().length) return;

        Content.populate();
        showLoadingImage($container);

        isFramed = (config && config.framed);
        if (!assetIndex) AssetIndexData.sendRequest(!activeSymbols);
    };

    var populateTable = function() {
        if(!activeSymbols || !assetIndex) return;

        $('#errorMsg').addClass('hidden');
        assetIndex = AssetIndex.getAssetIndexData(assetIndex, activeSymbols);
        marketColumns = AssetIndex.getMarketColumns();
        $tabs = $('<ul/>');
        $contents = $('<div/>');

        for(var i = 0; i < assetIndex.length; i++) {
            var assetItem  = assetIndex[i];
            var symbolInfo = assetItem[3];
            if(!symbolInfo) {
                continue;
            }
            var $submarketTable = getSubmarketTable(assetItem, symbolInfo);
            $submarketTable.find('tbody').append(createSubmarketTableRow(assetItem, symbolInfo));
        }

        $container
            .empty()
            .append($tabs)
            .append($('<div/>', {class: 'gr-padding-10'}))
            .append($contents.children());

        $container.tabs('destroy').tabs();

        if (isFramed) {
            $container.find('ul').hide();
            $('<div/>', {class: 'center-text'}).append(jqueryuiTabsToDropdown($container)).prependTo($container);
        }
    };

    var getSubmarketTable = function(assetItem, symbolInfo) {
        var marketID    = 'market-'    + symbolInfo.market;
        var submarketID = 'submarket-' + symbolInfo.submarket;

        var $table = $contents.find('#' + submarketID);
        if($table.length === 0) {
            // Create the table for this submarket
            var $market = $contents.find('#' + marketID);
            if($market.length === 0) {
                // Create the market and tab elements
                $market = $('<div/>', {id: marketID});
                $tabs.append($('<li/>').append($('<a/>', {href: '#' + marketID, text: symbolInfo.market_display_name, id: 'outline'})));
            }
            $table = createEmptyTable(assetItem, symbolInfo, submarketID);
            $market.append($table);
            $contents.append($market);
        }

        return $table;
    };

    var createSubmarketTableRow = function(assetItem, symbolInfo) {
        var cells   = [symbolInfo.display_name],
            columns = ["asset"];

        var marketCols = marketColumns[symbolInfo.market],
            assetCells = assetItem[4];
        for(var i = 1; i < marketCols.columns.length; i++) {
            var prop = marketCols.columns[i];
            if(prop.length > 0) {
                cells.push(prop in assetCells ? assetCells[prop] : '--');
                columns.push(prop);
            }
        }

        return Table.createFlexTableRow(cells, columns, "data");
    };

    var createEmptyTable = function(assetItem, symbolInfo, submarketID) {
        var market = symbolInfo.market;

        var metadata = {
            id: submarketID,
            cols: marketColumns[market].columns
        };

        var $submarketTable = Table.createFlexTable([], metadata, marketColumns[market].header);

        var $submarketHeader = $('<tr/>', {class: 'flex-tr'})
            .append($('<th/>', {class: 'flex-tr-child submarket-name', colspan: marketColumns[market].columns.length, text: symbolInfo.submarket_display_name}));
        $submarketTable.find('thead').prepend($submarketHeader);

        return $submarketTable;
    };

    return {
        init: init,
        setActiveSymbols: function(response) {
            activeSymbols = response.active_symbols;
            if(assetIndex) populateTable();
        },
        setAssetIndex: function(response) {
            assetIndex = response.asset_index;
            if(activeSymbols) populateTable();
        }
    };
}());
