var AssetIndex = (function() {
    "use strict";

    var marketColumns;

    // Search and Remove (to decrease the next search count)
    var getSymbolInfo = function(qSymbol, activeSymbols) {
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
    var getAssetIndexData = function(assetIndex, activeSymbols) {
        if(!assetIndex || !activeSymbols) return;

        marketColumns = {};

        // index of items in asset_index response
        var idx = {
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

        for(var i = 0; i < assetIndex.length; i++) {
            var assetItem = assetIndex[i];
            var symbolInfo = getSymbolInfo(assetItem[idx.symbol], activeSymbols)[0];
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
                if(marketCols.columns.indexOf(col) === -1) {
                    marketCols.header.push(assetCells[j][idx.cellDisplayName]);
                    marketCols.columns.push(col);
                }
            }
            assetItem.push(values);
        }
        return assetIndex;
    };

    var external = {
        getAssetIndexData: getAssetIndexData,
        getMarketColumns: function() {return marketColumns;}
    };
    if (typeof module !== 'undefined') {
        module.exports = external;
    }
    return external;
}());
