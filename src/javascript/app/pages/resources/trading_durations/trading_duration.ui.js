const TradingDuration  = require('./trading_duration');
const BinarySocket     = require('../../../base/socket');
const Table            = require('../../../common/attach_dom/table');
const localize         = require('../../../../_common/localize').localize;
const Login            = require('../../../../_common/base/login');
const CommonFunctions  = require('../../../../_common/common_functions');
const showLoadingImage = require('../../../../_common/utility').showLoadingImage;

const TradingDurationUI = (() => {
    const onLoad = () => {
        sendRequest();
    };

    const setHeader = (duration_market) => {
        const $tab_header = $('body').find('#trading_duration_tabs');
        const $header_slider = $('<li/>', { id: 'slider', class: 'slider' });
        duration_market.forEach((market) => {
            $tab_header.append($('<li/>').append($('<a/>', { href: `#${market.name}`, text: market.display_name, id: market.name })));
            $tab_header.append($header_slider);
            console.log(market)
        });
    };

    const setTable = (duration_data) => {

        console.log(duration_data);
    };

    const sendRequest = () => {
        BinarySocket.send({ trading_durations: 1 }).then((response) => {
            const trading_duration_data = TradingDuration.getTradingDurationData(response);
            const trading_duration_market = TradingDuration.getMarketColumns();

            setHeader(trading_duration_market);

            trading_duration_data.forEach((duration_data) => setTable(duration_data));
        });
    };

    return { onLoad };
})();

module.exports = TradingDurationUI;
