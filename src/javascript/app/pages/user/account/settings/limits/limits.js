const LimitsInit   = require('./limits.init');
const LimitsUI     = require('./limits.ui');
const BinarySocket = require('../../../../../base/socket');

const Limits = (() => {
    const onLoad = async () => {
        const response_get_limits = await BinarySocket.send({ get_limits: 1 });

        if (response_get_limits.error) {
            LimitsUI.limitsError(response_get_limits.error);
        }

        BinarySocket.send({ active_symbols: 'brief' }).then((response_active_symbols) => {
            // this is to get localized texts for the name of the market_specific limits
            LimitsInit.limitsHandler(response_get_limits, response_active_symbols);
        });
    };

    const onUnload = () => {
        LimitsInit.clean();
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = Limits;
