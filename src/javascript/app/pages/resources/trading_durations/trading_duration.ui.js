const TradingDuration  = require('./trading_duration');
const BinarySocket     = require('../../../base/socket');
const localize         = require('../../../../_common/localize').localize;
const TabSelector      = require('../../../../_common/tab_selector');
const Login            = require('../../../../_common/base/login');
const CommonFunctions  = require('../../../../_common/common_functions');
const showLoadingImage = require('../../../../_common/utility').showLoadingImage;

const TradingDurationUI = (() => {
    const onLoad = () => {
        TabSelector.onLoad();
        sendRequest();
    };

    const initializeData = (duration_data) => {
        const market_header = `#tab_${duration_data.market.name}-content`;
        
        $(market_header).append($('<div/>', { id: duration_data.submarket.name })
            .append($('<h3/>', { text: duration_data.submarket.display_name })));
        createEmptyTable(duration_data.submarket.name);
        setTableData(duration_data.submarket.name, duration_data.data);
    };

    const createEmptyTable = (submarket_name) => {
        const $submarket_header = $(`#${submarket_name}`);
        $submarket_header.append($('<table/>', { class: 'trading-durations__table' })
            .append($('<thead/>')
                .append($('<tr/>')
                    .append($('<th/>', { rowspan: 2, text: localize('Underlying Assets') }))
                    .append($('<th/>', { rowspan: 2, text: localize('Trade Types') }))
                    .append($('<th/>', { colspan: 5, text: localize('Duration Type') }))
                )
                .append($('<tr/>')
                    .append($('<td/>', { class: 'trading-durations__table--ticks', text: localize('Ticks') }))
                    .append($('<td/>', { text: localize('Seconds') }))
                    .append($('<td/>', { text: localize('Minutes') }))
                    .append($('<td/>', { text: localize('Hours') }))
                    .append($('<td/>', { text: localize('Days') }))
                )
            )
            .append($('<tbody/>')));
    };

    const setTableData = (submarket_name, datas) => {
        const $submarket_table_body = $(`#${submarket_name}`).find('tbody');
        datas.forEach((data, data_index) => {
            $submarket_table_body.append($('<tr/>', { id: `${submarket_name}${data_index}` })
                .append($('<th/>', { class: 'trading-durations__table--assets', rowspan: data.trade_durations.length + 1 }))
            );
            data.symbol.forEach((symbol) => {
                $submarket_table_body.find(`#${submarket_name}${data_index} .trading-durations__table--assets`)
                    .append(document.createTextNode(symbol.display_name))
                    .append($('<br/>'));
            });
            data.trade_durations.forEach((trade_duration, duration_index) => {
                const trade_duration_assets = getTradeDurationAssets(trade_duration);
                $submarket_table_body
                    .append($('<tr/>', { id: `${submarket_name}${data_index}${duration_index}` }));
                
                trade_duration_assets.forEach((asset) => {
                    $submarket_table_body.find(`#${submarket_name}${data_index}${duration_index}`)
                        .append($('<td/>', { text: asset }));
                });
            });
        });
    };

    const getTradeDurationAssets = (trade_duration) => {
        const asset_array = [];
        const duration_type_array = ['ticks', 's', 'm', 'h', 'days'];

        asset_array.push(trade_duration.trade_type.display_name);
        duration_type_array.forEach((type) => {
            if (trade_duration.durations.some((duration) => duration.name === type)) {
                const duration_min = trade_duration.durations.find((unit) => unit.name === type).min;
                const duration_max = trade_duration.durations.find((unit) => unit.name === type).max;
                asset_array.push(`${duration_min} - ${duration_max}`);
            } else {
                asset_array.push('-');
            }
        });
        return asset_array;
    };

    const sendRequest = () => {
        BinarySocket.send({ trading_durations: 1 }).then((response) => {
            const trading_duration_data = TradingDuration.getTradingDurationData(response);

            TabSelector.repositionSelector();

            trading_duration_data.forEach((duration_data) => initializeData(duration_data));
        });
    };

    return { onLoad };
})();

module.exports = TradingDurationUI;
