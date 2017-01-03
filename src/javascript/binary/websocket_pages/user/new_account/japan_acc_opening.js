const handleResidence     = require('../../../common_functions/account_opening').handleResidence;
const Content             = require('../../../common_functions/content').Content;
const ValidAccountOpening = require('../../../common_functions/valid_account_opening').ValidAccountOpening;
const detect_hedging      = require('../../../common_functions/common_functions').detect_hedging;
const Client              = require('../../../base/client').Client;
const url_for             = require('../../../base/url').url_for;
const JapanAccOpeningUI   = require('./japan_acc_opening/japan_acc_opening.ui').JapanAccOpeningUI;

const JapanAccOpening = (function() {
    const init = function() {
        Content.populate();
        ValidAccountOpening.redirectCookie();
        if (Client.get_value('residence') !== 'jp') {
            window.location.href = url_for('trading');
            return;
        }
        handleResidence();
        detect_hedging($('#trading-purpose'), $('.hedging-assets'));
        $('#japan-form').submit(function(evt) {
            evt.preventDefault();
            if (JapanAccOpeningUI.checkValidity()) {
                BinarySocket.init({
                    onmessage: function(msg) {
                        const response = JSON.parse(msg.data);
                        if (response) {
                            const type = response.msg_type;
                            if (type === 'new_account_japan') {
                                ValidAccountOpening.handler(response, response.new_account_japan);
                            } else if (type === 'sanity_check') {
                                ValidAccountOpening.handler(response);
                            }
                        }
                    },
                });
                JapanAccOpeningUI.fireRequest();
            }
        });
    };

    return {
        init: init,
    };
})();

module.exports = {
    JapanAccOpening: JapanAccOpening,
};
