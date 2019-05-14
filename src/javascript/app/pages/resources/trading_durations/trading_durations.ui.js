const TradingDuration  = require('./trading_durations');
const BinarySocket     = require('../../../base/socket');
const isEuCountry      = require('../../../common/country_base').isEuCountry;
const localize         = require('../../../../_common/localize').localize;
const TabSelector      = require('../../../../_common/tab_selector');
const Login            = require('../../../../_common/base/login');
const CommonFunctions  = require('../../../../_common/common_functions');
const showLoadingImage = require('../../../../_common/utility').showLoadingImage;
const Url              = require('../../../../_common/url');

const TradingDurationUI = (() => {
    let $loading_container;

    const onLoad = () => {
        // Initialize loading and tab selector
        $loading_container = $('#trading_durations_loading');
        showLoadingImage($loading_container[0]);
        TabSelector.onLoad();
        TabSelector.onChangeTab(onChangeTabSelector);

        sendRequest();
    };

    const populateTable = (duration_data) => {
        const $market_tab   = $(`#tab_${duration_data.market.name}`);
        const $market_header = $(`#tab_${duration_data.market.name}-content`);
        const url_anchor = duration_data.market.name === 'volidx' ? 'volatility-indices' : duration_data.market.name;
        
        $market_tab.setVisibility(1);
        $market_header.setVisibility(1);

        $market_header.append($('<div/>', { id: duration_data.submarket.name })
            .append($('<h2/>', { id: 'trading_durations_subtitle' })
                .append($('<span/>', { text: duration_data.submarket.display_name  }))
                .append($('<a/>', { text: 'ⓘ', target: '_blank', rel: 'noopener noreferer', href: `${Url.urlFor('get-started/binary-options')}?anchor=${url_anchor}#range-of-markets` }))
            ));

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
            const trade_durations_length = data.trade_durations.length;
            const asset_symbol_length    = data.symbol.length;
            const length_difference      = asset_symbol_length > trade_durations_length ?
                asset_symbol_length - trade_durations_length : 0;
            const rowspan_length         = trade_durations_length + length_difference + 1;

            $submarket_table_body.append($('<tr/>', { id: `${submarket_name}${data_index}` })
                .append($('<th/>', { id: 'trading_durations_assets', rowspan: rowspan_length }))
            );

            data.symbol.forEach((symbol) => {
                $submarket_table_body.find(`#${submarket_name}${data_index} #trading_durations_assets`)
                    .append(document.createTextNode(symbol.display_name))
                    .append($('<br/>'));
            });

            data.trade_durations.forEach((trade_duration, duration_index) => {
                const trade_duration_assets = TradingDuration.getTradeDurationAssets(trade_duration);
                if (duration_index === data.trade_durations.length - 1 &&
                    asset_symbol_length <= trade_durations_length) {
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

            // Handle Empty trade types case
            if (asset_symbol_length > trade_durations_length) {
                const length_array = [...Array(length_difference).keys()];
                const empty_asset_array = [...Array(6).keys()];

                length_array.forEach((length, length_index) => {
                    if (length_array.length === length_index + 1) {
                        $submarket_table_body
                            .append($('<tr/>', { id: `${submarket_name}${data_index}empty${length_index}`, class: 'table_last_item' }));
                    } else {
                        $submarket_table_body
                            .append($('<tr/>', { id: `${submarket_name}${data_index}empty${length_index}`, class: 'empty_data' }));
                    }

                    empty_asset_array.forEach(() => {
                        $submarket_table_body.find(`#${submarket_name}${data_index}empty${length_index}`)
                            .append($('<td/>').html('&nbsp;'));
                    });
                });
            }
        });
    };

    const setSelectedTab = () => {
        let default_tab = 'tab_forex';
        const selector = 'duration_assets';

        if ($('#duration_assets').find(`#${default_tab}`).hasClass('invisible')) default_tab = 'tab_volidx';

        Url.updateParamsWithoutReload({
            [selector]: default_tab,
        }, true);
    };
    const onChangeTabSelector = () => {
        const active_tab = document.getElementsByClassName('a-active');
        const mobile_header_tab = document.getElementById('tab_mobile_header');
        mobile_header_tab.innerHTML = active_tab[0].innerHTML;
    };

    const sendRequest = () => {
        BinarySocket.send({ trading_durations: 1 }).then((response) => {
            const trading_duration_data = TradingDuration.getTradingDurationData(response);
            const active_tab = document.getElementsByClassName('a-active');
            const mobile_header_tab = document.getElementById('tab_mobile_header');

            // handle empty trading duration, E.g: unsupported accounts or residence
            if (trading_duration_data.length) {
                // initialize tab selector for mobile view
                mobile_header_tab.innerHTML = active_tab[0].innerHTML;

                // populate data into table
                trading_duration_data.forEach((duration_data) => populateTable(duration_data));

                if (isEuCountry()) {
                    setSelectedTab();
                }

                TabSelector.repositionSelector();

                // tab selector positioning and remove loading
                $loading_container.setVisibility(0);
            } else {
                $('#trading_durations_empty').setVisibility(1);
                $('#trading_durations_content').hide();
                const empty_trading_durations_btn_login = CommonFunctions.getElementById('empty-trading-durations-btn-login');
                empty_trading_durations_btn_login.removeEventListener('click', loginOnClick);
                empty_trading_durations_btn_login.addEventListener('click', loginOnClick);
                $loading_container.setVisibility(0);
            }

        });
    };

    const loginOnClick = (e) => {
        e.preventDefault();
        Login.redirectToLogin();
    };

    return { onLoad };
})();

module.exports = TradingDurationUI;
