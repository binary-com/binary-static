const BinarySocket = require('../../../socket');
const LimitsInit   = require('./limits/limits.init');

const Limits = (() => {
    const onLoad = () => {
        BinarySocket.send({ get_limits: 1 }).then((response) => {
            if (response.error) {
                LimitsInit.limitsError(response.error);
            } else {
                LimitsInit.limitsHandler(response);
            }
        });
    };

    const onUnload = () => {
        LimitsInit.clean();
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = Limits;
