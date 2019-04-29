const TradingDuration  = require('./trading_duration');
const BinarySocket     = require('../../../base/socket');
const Table            = require('../../../common/attach_dom/table');
const Login            = require('../../../../_common/base/login');
const CommonFunctions  = require('../../../../_common/common_functions');
const showLoadingImage = require('../../../../_common/utility').showLoadingImage;

const TradingDurationUI = (() => {
    const onLoad = () => {
        sendRequest();
    };

    const sendRequest = () => {
        BinarySocket.send({ trading_durations: 1 }).then((response) => {
            console.log(response);
        });
    };

    return { onLoad };
})();

module.exports = TradingDurationUI;
