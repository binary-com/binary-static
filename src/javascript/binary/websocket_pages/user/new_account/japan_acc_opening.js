var handleResidence     = require('../../../common_functions/account_opening').handleResidence;
var Content             = require('../../../common_functions/content').Content;
var ValidAccountOpening = require('../../../common_functions/valid_account_opening').ValidAccountOpening;
var detect_hedging      = require('../../../common_functions/common_functions').detect_hedging;
var Client              = require('../../../base/client').Client;
var JapanAccOpeningUI   = require('./japan_acc_opening/japan_acc_opening.ui').JapanAccOpeningUI;

var JapanAccOpening = (function() {
    var init = function() {
        Content.populate();
        ValidAccountOpening.redirectCookie();
        if (Client.get_value('residence') !== 'jp') {
            window.location.href = page.url.url_for('trading');
            return;
        }
        handleResidence();
        detect_hedging($('#trading-purpose'), $('.hedging-assets'));
        $('#japan-form').submit(function(evt) {
            evt.preventDefault();
            if (JapanAccOpeningUI.checkValidity()) {
                BinarySocket.init({
                    onmessage: function(msg) {
                        var response = JSON.parse(msg.data);
                        if (response) {
                            var type = response.msg_type;
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
