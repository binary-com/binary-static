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
            .append($('<h2/>', { text: duration_data.submarket.display_name, id: 'trading_durations_subtitle' })));
        createEmptyTable(duration_data.submarket.name);
        setTableData(duration_data.submarket.name, duration_data.data);
    };

    const createEmptyTable = (submarket_name) => {
        const $submarket_header = $(`#${submarket_name}`);
        $submarket_header.append($('<table/>', { class: 'table-container' })
            .append($('<thead/>')
                .append($('<tr/>')
                    .append($('<th/>', { rowspan: 2, text: localize('Underlying Assets') }))
                    .append($('<th/>', { rowspan: 2, text: localize('Trade Types') }))
                    .append($('<th/>', { colspan: 5, text: localize('Duration Type'), id: 'trading_durations_type' }))
                )
                .append($('<tr/>')
                    .append($('<td/>', { id: 'trading_durations_ticks', text: localize('Ticks') }))
                    .append($('<td/>', { text: localize('Seconds') }))
                    .append($('<td/>', { text: localize('Minutes') }))
                    .append($('<td/>', { text: localize('Hours') }))
                    .append($('<td/>', { text: localize('Days') }))
                )
            )
            .append($('<tbody/>')));
        $submarket_header.append($('<div/>', { class: 'hint', text: localize('1. A tick is an updated market price. Tick frequency can vary with a minimum price change of zero') }));
    };

    const setTableData = (submarket_name, datas) => {
        const $submarket_table_body = $(`#${submarket_name}`).find('tbody');
        datas.forEach((data, data_index) => {
            $submarket_table_body.append($('<tr/>', { id: `${submarket_name}${data_index}` })
                .append($('<th/>', { id: 'trading_durations_assets', rowspan: data.trade_durations.length + 1 }))
            );
            data.symbol.forEach((symbol) => {
                $submarket_table_body.find(`#${submarket_name}${data_index} #trading_durations_assets`)
                    .append(document.createTextNode(symbol.display_name))
                    .append($('<br/>'));
            });
            data.trade_durations.forEach((trade_duration, duration_index) => {
                const trade_duration_assets = getTradeDurationAssets(trade_duration);
                if (duration_index === data.trade_durations.length - 1) {
                    $submarket_table_body
                        .append($('<tr/>', { id: `${submarket_name}${data_index}${duration_index}`, class: 'table_last_item' }));
                } else {
                    $submarket_table_body
                        .append($('<tr/>', { id: `${submarket_name}${data_index}${duration_index}` }));
                }
                
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
