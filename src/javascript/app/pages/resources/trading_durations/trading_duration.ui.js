const TradingDuration  = require('./trading_duration');
const BinarySocket     = require('../../../base/socket');
const localize         = require('../../../../_common/localize').localize;
const Login            = require('../../../../_common/base/login');
const CommonFunctions  = require('../../../../_common/common_functions');
const showLoadingImage = require('../../../../_common/utility').showLoadingImage;

const TradingDurationUI = (() => {
    let $trading_durations;
    const onLoad = () => {
        $trading_durations = $('#trading_durations');
        sendRequest();
    };

    const setHeader = (duration_market) => {
        const $tab_header = $trading_durations.find('#trading_duration_tabs');
        const $header_slider = $('<li/>', { id: 'slider', class: 'slider' });
        duration_market.forEach((market) => {
            $tab_header.append($('<li/>')
                .append($('<a/>', {
                    href: `#${market.name}`,
                    text: market.display_name,
                    id  : market.name }
                ))
            );
            $tab_header.append($header_slider);
            console.log(market)
        });
    };

    const initializeData = (duration_data) => {
        const data_wrapper = $trading_durations.find('#trading_durations_data');
        const market_header = `#market_${duration_data.market.name}`;
        if ($trading_durations.find(market_header).length) {
            $(market_header).append($('<div/>', { id: duration_data.submarket.name })
                .append($('<h3/>', { text: duration_data.submarket.display_name })));
            createEmptyTable(duration_data.submarket.name);
            generateData(duration_data.submarket.name, duration_data.data);
        } else {
            data_wrapper.append($('<div/>', { id: market_header.slice(1) })
                .append($('<div/>', { id: duration_data.submarket.name })
                    .append($('<h3/>', { text: duration_data.submarket.display_name }))));
            createEmptyTable(duration_data.submarket.name);
            generateData(duration_data.submarket.name, duration_data.data);
        }
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
            .append($('<tbody/>')
                .append($('<tr/>')
                    .append($('<th/>', { rowspan: 5, class: 'trading-durations__table--assets' })))));
    };

    const generateData = (submarket_name, datas) => {
        const $submarket_table_body = $(`#${submarket_name}`).find('tbody');
        datas.forEach((data) => {
            console.log(data)
            data.symbol.forEach((symbol) => {
                $submarket_table_body.find('.trading-durations__table--assets')
                    .append(document.createTextNode(symbol.display_name))
                    .append($('<br/>'));
            });
        });
        console.log(datas);
    };

    const sendRequest = () => {
        BinarySocket.send({ trading_durations: 1 }).then((response) => {
            const trading_duration_data = TradingDuration.getTradingDurationData(response);
            const trading_duration_market = TradingDuration.getMarketColumns();

            setHeader(trading_duration_market);

            trading_duration_data.forEach((duration_data) => initializeData(duration_data));
        });
    };

    return { onLoad };
})();

module.exports = TradingDurationUI;
