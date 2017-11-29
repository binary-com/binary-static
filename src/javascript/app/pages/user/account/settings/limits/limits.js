const LimitsInit   = require('./limits.init');
const BinarySocket = require('../../../../../base/socket');

const Limits = (() => {
    const onLoad = () => {
        BinarySocket.wait('get_account_status').then((response_get_account_status) => {
            BinarySocket.send({ get_limits: 1 }).then((response) => {
                if (response.error) {
                    LimitsInit.limitsError(response.error);
                } else {
                    LimitsInit.limitsHandler(response, response_get_account_status);
                }
            });
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
