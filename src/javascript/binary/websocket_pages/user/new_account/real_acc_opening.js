var handleResidence     = require('../../../common_functions/account_opening').handleResidence;
var Content             = require('../../../common_functions/content').Content;
var ValidAccountOpening = require('../../../common_functions/valid_account_opening').ValidAccountOpening;
var Client              = require('../../../base/client').Client;
var url_for             = require('../../../base/url').url_for;
var RealAccOpeningUI    = require('./real_acc_opening/real_acc_opening.ui').RealAccOpeningUI;

var RealAccOpening = (function() {
    var init = function() {
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
                        var response = JSON.parse(msg.data);
                        if (response) {
                            if (response.msg_type === 'authorize' && !Client.is_virtual()) {
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
