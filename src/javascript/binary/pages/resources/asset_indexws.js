var AssetIndexWS = (function() {
    "use strict";

    var $container,
        $tabs,
        $contents;
    
    var activeSymbols,
        assetIndex,
        marketColumns,
        idx;

    var init = function() {
        $container = $('#asset-index');
        showLoadingImage($container);
        marketColumns = {};
        activeSymbols = null;
        assetIndex = null;
        // index of items in asset_index response
        idx = {
            symbol: 0,
            displayName: 1,
            cells : 2,
                cellName: 0,
                cellDisplayName: 1,
                cellFrom: 2,
                cellTo  : 3,
            symInfo: 3,
            values : 4
        };

        var $args = {
            active_symbols: "brief"
        };
        if (isJapanTrading()) {
            $args['landing_company'] = "japan";
        }

        BinarySocket.send($args);
        BinarySocket.send({"asset_index": 1});
    };

    var getActiveSymbols = function(response) {
        activeSymbols = response.active_symbols;
        if(assetIndex) {
            populateTable();
        }
    };

    var getAssetIndex = function(response) {
        assetIndex = response.asset_index;
        if(activeSymbols) {
            populateTable();
        }
    };

    // Search and Remove (to decrease the next search count)
    var getSymbolInfo = function(qSymbol) {
        return activeSymbols.filter(function(sy, id) {
            if(sy.symbol === qSymbol) {
                activeSymbols.splice(id, 1);
                return true;
            }
        });
    };

    /*
     * This method generates headers for all tables of each market
     * should include headers existed in all assets of each market and its submarkets
     */
    var organizeData = function() {
        for(var i = 0; i < assetIndex.length; i++) {
            var assetItem = assetIndex[i];
            var symbolInfo = getSymbolInfo(assetItem[idx.symbol])[0];
            if(!symbolInfo) {
                continue;
            }
            var market = symbolInfo.market;

            assetItem.push(symbolInfo);

            // Generate market columns to use in all this market's submarket tables
            if(!(market in marketColumns)) {
                marketColumns[market] = {
                    header : [''],
                    columns: ['']
                };
            }

            var assetCells = assetItem[idx.cells],
                values = {};
            for(var j = 0; j < assetCells.length; j++) {
                var col  = assetCells[j][idx.cellName];
                
                values[col] = assetCells[j][idx.cellFrom] + ' - ' + assetCells[j][idx.cellTo];
                
                var marketCols = marketColumns[market];
                if($.inArray(col, marketCols.columns) === -1) {
                    marketCols.header.push(text.localize(assetCells[j][idx.cellDisplayName]));
                    marketCols.columns.push(col);
                }
            }
            assetItem.push(values);
        }
    };

    var populateTable = function() {
        $('#errorMsg').addClass('hidden');
        organizeData();

        var isJapan = page.language().toLowerCase() === 'ja';
        
        $tabs = $('<ul/>', {class: isJapan ? 'hidden' : ''});
        $contents = $('<div/>');

        for(var i = 0; i < assetIndex.length; i++) {
            var assetItem  = assetIndex[i];
            var symbolInfo = assetItem[idx.symInfo];
            if(!symbolInfo) {
                continue;
            }

            // just show "Major Pairs" when the language is JA
            if(isJapan && symbolInfo.submarket !== 'major_pairs') {
                continue;
            }            

            var $submarketTable = getSubmarketTable(assetItem, symbolInfo);
            $submarketTable.find('tbody').append(createSubmarketTableRow(assetItem, symbolInfo));
        }

        $container
            .empty()
            .append($tabs)
            .append($('<div/>', {class: 'grd-row-padding'}))
            .append($contents.children());

        $container.tabs('destroy').tabs();
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
            assetCells = assetItem[idx.values];
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
        getAssetIndex: getAssetIndex,
        getActiveSymbols: getActiveSymbols
    };
}());



pjax_config_page("asset_indexws", function() {
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg) {
                    var response = JSON.parse(msg.data);
                    if (response) {
                        if (response.msg_type === "asset_index") {
                            AssetIndexWS.getAssetIndex(response);
                        }
                        else if (response.msg_type === "active_symbols") {
                            AssetIndexWS.getActiveSymbols(response);
                        }
                    }
                }
            });

            Content.populate();
            AssetIndexWS.init();
        }
    };
});
