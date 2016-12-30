const handleResidence     = require('../../../common_functions/account_opening').handleResidence;
const Content             = require('../../../common_functions/content').Content;
const ValidAccountOpening = require('../../../common_functions/valid_account_opening').ValidAccountOpening;
const Client              = require('../../../base/client').Client;
const url_for             = require('../../../base/url').url_for;
const RealAccOpeningUI    = require('./real_acc_opening/real_acc_opening.ui').RealAccOpeningUI;

const RealAccOpening = (function() {
    const init = function() {
        Content.populate();
        ValidAccountOpening.redirectCookie();
        handleResidence();
        if (Client.get_value('residence')) {
            BinarySocket.send({ landing_company: Client.get_value('residence') });
        }
        BinarySocket.send({ residence_list: 1 });
        $('#real-form').submit(function(evt) {
            evt.preventDefault();
            if (RealAccOpeningUI.checkValidity()) {
                BinarySocket.init({
                    onmessage: function(msg) {
                        const response = JSON.parse(msg.data);
                        if (response) {
                            if (response.msg_type === 'authorize' && !Client.get_boolean('is_virtual')) {
                                window.location.href = url_for('trading');
                            }                            else if (response.msg_type === 'new_account_real') {
                                ValidAccountOpening.handler(response, response.new_account_real);
                            }
                        }
                    },
                });
            }
        });
    };

    return {
        init: init,
    };
})();

module.exports = {
    RealAccOpening: RealAccOpening,
};
