const LimitsWS = require('./limits/limits.init').LimitsWS;
const Content  = require('../../../../common_functions/content').Content;
const Client   = require('../../../../base/client').Client;

const Limits = (function() {
    const onLoad = function() {
        Content.populate();
        if (Client.get('is_virtual')) {
            LimitsWS.limitsError();
            return;
        }

        BinarySocket.init({
            onmessage: function(msg) {
                const response = JSON.parse(msg.data);
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
            },
        });

        BinarySocket.send({ get_limits: 1 });
    };

    const onUnload = function() {
        LimitsWS.clean();
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = {
    Limits: Limits,
};
