const LimitsWS = require('./limits/limits.init');
const Content  = require('../../../../common_functions/content').Content;
const Client   = require('../../../../base/client').Client;

const Limits = (() => {
    const onLoad = () => {
        Content.populate();
        if (Client.get('is_virtual')) {
            LimitsWS.limitsError();
            return;
        }

        BinarySocket.send({ get_limits: 1 }).then((response) => {
            if (response) {
                const type = response.msg_type;
                const error = response.error;

                if (type === 'authorize' && Client.get('is_virtual')) {
                    LimitsWS.limitsError(error);
                } else if (type === 'get_limits' && !error) {
                    LimitsWS.limitsHandler(response);
                } else if (error) {
                    LimitsWS.limitsError(error);
                }
            }
        });
    };

    const onUnload = () => {
        LimitsWS.clean();
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = Limits;
