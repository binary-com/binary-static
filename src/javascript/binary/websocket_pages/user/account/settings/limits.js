const LimitsInit = require('./limits/limits.init');
const Content    = require('../../../../common_functions/content').Content;

const Limits = (() => {
    const onLoad = () => {
        Content.populate();

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
