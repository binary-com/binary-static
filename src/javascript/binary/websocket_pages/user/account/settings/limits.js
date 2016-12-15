var LimitsWS = require('./limits/limits.init').LimitsWS;
var Content = require('../../../../common_functions/content').Content;

var Limits = (function() {
    var onLoad = function() {
        Content.populate();
        var titleElement = document.getElementById('limits-ws-container').firstElementChild;
        titleElement.textContent = page.text.localize('Trading and Withdrawal Limits');
        if (TUser.get().is_virtual) {
            LimitsWS.limitsError();
            return;
        }

        BinarySocket.init({
            onmessage: function(msg) {
                var response = JSON.parse(msg.data);
                if (response) {
                    var type = response.msg_type;
                    var error = response.error;

                    if (type === 'authorize' && TUser.get().is_virtual) {
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

    var onUnload = function() {
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
