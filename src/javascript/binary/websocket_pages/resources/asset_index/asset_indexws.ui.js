const AssetIndexData         = require('./asset_indexws.data').AssetIndexData;
const AssetIndex             = require('../asset_indexws').AssetIndex;
const BinaryPjax             = require('../../../base/binary_pjax');
const State                  = require('../../../base/storage').State;
const showLoadingImage       = require('../../../base/utility').showLoadingImage;
const Table                  = require('../../../common_functions/attach_dom/table').Table;
const jqueryuiTabsToDropdown = require('../../../common_functions/common_functions').jqueryuiTabsToDropdown;
const Content                = require('../../../common_functions/content').Content;
const japanese_client        = require('../../../common_functions/country_base').japanese_client;

const AssetIndexUI = (function() {
    'use strict';

    let $container,
        $tabs,
        $contents,
        activeSymbols,
        assetIndex,
        marketColumns,
        isFramed;

    const onLoad = function(config) {
        if (japanese_client()) {
            if (!State.get('is_beta_trading')) {
                BinaryPjax.load('resources');
            }
            return;
        }

        $container = $('#asset-index');
        assetIndex = marketColumns = undefined;
        if (!State.get('is_beta_trading')) activeSymbols = undefined;

        if ($container.contents().length) return;

        Content.populate();
        showLoadingImage($container);

        isFramed = (config && config.framed);
        if (!assetIndex) {
            initSocket();
            AssetIndexData.sendRequest(!activeSymbols);
        }
        $container.tabs();
    };

    const populateTable = function() {
        if (!activeSymbols || !assetIndex) return;

        $('#errorMsg').addClass('hidden');
        assetIndex = AssetIndex.getAssetIndexData(assetIndex, activeSymbols);
        marketColumns = AssetIndex.getMarketColumns();
        $tabs = $('<ul/>');
        $contents = $('<div/>');

        for (let i = 0; i < assetIndex.length; i++) {
            const assetItem  = assetIndex[i];
            const symbolInfo = assetItem[3];
            if (symbolInfo) {
                const $submarketTable = getSubmarketTable(assetItem, symbolInfo);
                $submarketTable.find('tbody').append(createSubmarketTableRow(assetItem, symbolInfo));
            }
        }

        $container.empty().append($tabs).append($contents.children());

        $container.tabs('destroy').tabs();

        if (isFramed) {
            $container.find('ul').hide();
            $('<div/>', { class: 'center-text' }).append(jqueryuiTabsToDropdown($container)).prependTo($container);
        }
    };

    const getSubmarketTable = function(assetItem, symbolInfo) {
        const marketID    = 'market-'    + symbolInfo.market;
        const submarketID = 'submarket-' + symbolInfo.submarket;

        let $table = $contents.find('#' + submarketID);
        if ($table.length === 0) {
            // Create the table for this submarket
            let $market = $contents.find('#' + marketID);
            if ($market.length === 0) {
                // Create the market and tab elements
                $market = $('<div/>', { id: marketID });
                $tabs.append($('<li/>').append($('<a/>', { href: '#' + marketID, text: symbolInfo.market_display_name, id: 'outline' })));
            }
            $table = createEmptyTable(assetItem, symbolInfo, submarketID);
            $market.append($table);
            $contents.append($market);
        }

        return $table;
    };

    const createSubmarketTableRow = function(assetItem, symbolInfo) {
        const cells   = [symbolInfo.display_name],
            columns = ['asset'];

        const marketCols = marketColumns[symbolInfo.market],
            assetCells = assetItem[4];
        for (let i = 1; i < marketCols.columns.length; i++) {
            const prop = marketCols.columns[i];
            if (prop.length > 0) {
                cells.push(prop in assetCells ? assetCells[prop] : '--');
                columns.push(prop);
            }
        }

        return Table.createFlexTableRow(cells, columns, 'data');
    };

    const createEmptyTable = function(assetItem, symbolInfo, submarketID) {
        const market = symbolInfo.market;

        const metadata = {
            id  : submarketID,
            cols: marketColumns[market].columns,
        };

        const $submarketTable = Table.createFlexTable([], metadata, marketColumns[market].header);

        const $submarketHeader = $('<tr/>', { class: 'flex-tr' })
            .append($('<th/>', { class: 'flex-tr-child submarket-name', colspan: marketColumns[market].columns.length, text: symbolInfo.submarket_display_name }));
        $submarketTable.find('thead').prepend($submarketHeader);

        return $submarketTable;
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
        if (msg_type === 'asset_index') {
            AssetIndexUI.setAssetIndex(response);
        } else if (msg_type === 'active_symbols') {
            AssetIndexUI.setActiveSymbols(response);
        }
    };

    return {
        onLoad          : onLoad,
        setActiveSymbols: function(response) {
            activeSymbols = response.active_symbols.slice(0); // clone
            if (assetIndex) populateTable();
        },
        setAssetIndex: function(response) {
            assetIndex = response.asset_index;
            if (activeSymbols) populateTable();
        },
    };
})();

module.exports = AssetIndexUI;
