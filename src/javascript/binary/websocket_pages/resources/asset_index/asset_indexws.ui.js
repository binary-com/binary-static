const showLoadingImage       = require('../../../base/utility').showLoadingImage;
const Table                  = require('../../../common_functions/attach_dom/table').Table;
const jqueryuiTabsToDropdown = require('../../../common_functions/common_functions').jqueryuiTabsToDropdown;
const Content                = require('../../../common_functions/content').Content;
const japanese_client        = require('../../../common_functions/country_base').japanese_client;
const AssetIndex             = require('../asset_indexws');
const State                  = require('../../../base/storage').State;
const url_for                = require('../../../base/url').url_for;

const AssetIndexUI = (() => {
    'use strict';

    let $container,
        $tabs,
        $contents,
        active_symbols,
        asset_index,
        market_columns,
        is_framed;

    const init = (config) => {
        if (japanese_client()) {
            if (!State.get('is_beta_trading')) {
                window.location.href = url_for('resources');
            }
            return;
        }

        $container = $('#asset-index');
        asset_index = market_columns = undefined;
        if (!State.get('is_beta_trading')) active_symbols = undefined;

        if ($container.contents().length) return;

        Content.populate();
        showLoadingImage($container);

        is_framed = (config && config.framed);
        if (!asset_index) {
            sendRequest();
        }
        $container.tabs();
    };

    const populateTable = () => {
        if (!active_symbols || !asset_index) return;

        $('#errorMsg').addClass('hidden');
        asset_index = AssetIndex.getAssetIndexData(asset_index, active_symbols);
        market_columns = AssetIndex.getMarketColumns();
        $tabs = $('<ul/>');
        $contents = $('<div/>');

        for (let i = 0; i < asset_index.length; i++) {
            const asset_item  = asset_index[i];
            const symbol_info = asset_item[3];
            if (symbol_info) {
                const $submarket_table = getSubmarketTable(asset_item, symbol_info);
                $submarket_table.find('tbody').append(createSubmarketTableRow(asset_item, symbol_info));
            }
        }

        $container.empty().append($tabs).append($contents.children());

        $container.tabs('destroy').tabs();

        if (is_framed) {
            $container.find('ul').hide();
            $('<div/>', { class: 'center-text' }).append(jqueryuiTabsToDropdown($container)).prependTo($container);
        }
    };

    const getSubmarketTable = (asset_item, symbol_info) => {
        const market_id    = 'market-'    + symbol_info.market;
        const submarket_id = 'submarket-' + symbol_info.submarket;

        let $table = $contents.find('#' + submarket_id);
        if ($table.length === 0) {
            // Create the table for this submarket
            let $market = $contents.find('#' + market_id);
            if ($market.length === 0) {
                // Create the market and tab elements
                $market = $('<div/>', { id: market_id });
                $tabs.append($('<li/>').append($('<a/>', { href: '#' + market_id, text: symbol_info.market_display_name, id: 'outline' })));
            }
            $table = createEmptyTable(asset_item, symbol_info, submarket_id);
            $market.append($table);
            $contents.append($market);
        }

        return $table;
    };

    const createSubmarketTableRow = (asset_item, symbol_info) => {
        const cells   = [symbol_info.display_name],
            columns = ['asset'];

        const market_cols = market_columns[symbol_info.market],
            asset_cells = asset_item[4];
        for (let i = 1; i < market_cols.columns.length; i++) {
            const prop = market_cols.columns[i];
            if (prop.length > 0) {
                cells.push(prop in asset_cells ? asset_cells[prop] : '--');
                columns.push(prop);
            }
        }

        return Table.createFlexTableRow(cells, columns, 'data');
    };

    const createEmptyTable = (asset_item, symbol_info, submarket_id) => {
        const market = symbol_info.market;

        const metadata = {
            id  : submarket_id,
            cols: market_columns[market].columns,
        };

        const $submarket_table = Table.createFlexTable([], metadata, market_columns[market].header);

        const $submarket_header = $('<tr/>', { class: 'flex-tr' })
            .append($('<th/>', { class: 'flex-tr-child submarket-name', colspan: market_columns[market].columns.length, text: symbol_info.submarket_display_name }));
        $submarket_table.find('thead').prepend($submarket_header);

        return $submarket_table;
    };

    const sendRequest = () => {
        if (State.get('is_beta_trading')) return;
        if (!active_symbols) {
            BinarySocket.send({ active_symbols: 'brief' }).then((response) => {
                AssetIndexUI.setActiveSymbols(response);
            });
        }
        BinarySocket.send({ asset_index: 1 }).then((response) => {
            AssetIndexUI.setAssetIndex(response);
        });
    };

    return {
        init            : init,
        setActiveSymbols: (response) => {
            active_symbols = response.active_symbols.slice(0); // clone
            if (asset_index) populateTable();
        },
        setAssetIndex: (response) => {
            asset_index = response.asset_index;
            if (active_symbols) populateTable();
        },
    };
})();

module.exports = AssetIndexUI;
