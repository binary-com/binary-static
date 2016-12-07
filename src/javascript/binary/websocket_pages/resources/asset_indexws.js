var AssetIndex = (function() {
    'use strict';

    var marketColumns;

    // Search and Remove (to decrease the next search count)
    var getSymbolInfo = function(qSymbol, activeSymbols) {
        return activeSymbols.filter(function(sy, id) {
            if (sy.symbol === qSymbol) {
                activeSymbols.splice(id, 1);
                return true;
            }
            return false;
        });
    };

    /*
     * This method generates headers for all tables of each market
     * should include headers existed in all assets of each market and its submarkets
     */
    var getAssetIndexData = function(assetIndex, activeSymbols) {
        if (!assetIndex || !activeSymbols) return null;

        marketColumns = {};

        // index of items in asset_index response
        var idx = {
            symbol     : 0,
            displayName: 1,
            cells      : 2,
            symInfo    : 3,
            values     : 4,
            cellProps  : {
                cellName       : 0,
                cellDisplayName: 1,
                cellFrom       : 2,
                cellTo         : 3,
            },
        };

        for (var i = 0; i < assetIndex.length; i++) {
            var assetItem = assetIndex[i];
            var symbolInfo = getSymbolInfo(assetItem[idx.symbol], activeSymbols)[0];
            if (symbolInfo) {
                var market = symbolInfo.market;

                assetItem.push(symbolInfo);

                // Generate market columns to use in all this market's submarket tables
                if (!(market in marketColumns)) {
                    marketColumns[market] = {
                        header : [''],
                        columns: [''],
                    };
                }

                var assetCells = assetItem[idx.cells],
                    values = {};
                for (var j = 0; j < assetCells.length; j++) {
                    var col  = assetCells[j][idx.cellProps.cellName];

                    values[col] = assetCells[j][idx.cellProps.cellFrom] + ' - ' + assetCells[j][idx.cellProps.cellTo];

                    var marketCols = marketColumns[market];
                    if (marketCols.columns.indexOf(col) === -1) {
                        marketCols.header.push(assetCells[j][idx.cellProps.cellDisplayName]);
                        marketCols.columns.push(col);
                    }
                }
                assetItem.push(values);
            }
        }
        return assetIndex;
    };

    var external = {
        getAssetIndexData: getAssetIndexData,
        getMarketColumns : function() { return marketColumns; },
    };
    return external;
})();

module.exports = {
    AssetIndex: AssetIndex,
};
