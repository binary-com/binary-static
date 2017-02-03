const handleResidence     = require('../../../common_functions/account_opening').handleResidence;
const populateObjects     = require('../../../common_functions/account_opening').populateObjects;
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
        if (Client.get('residence') !== 'jp') {
            window.location.href = url_for('trading');
            return;
        }
        handleResidence();
        const objects = populateObjects();
        const elementObj = objects.elementObj;
        const errorObj = objects.errorObj;
        const errorEl = document.getElementsByClassName('notice-msg')[0];

        detect_hedging($('#trading_purpose'), $('.hedging-assets'));

        $('#japan-form').off('submit').on('submit', function(evt) {
            evt.preventDefault();
            if (JapanAccOpeningUI.checkValidity(elementObj, errorObj, errorEl)) {
                BinarySocket.init({
                    onmessage: function(msg) {
                        const response = JSON.parse(msg.data);
                        if (response) {
                            const type = response.msg_type;
                            if (type === 'new_account_japan') {
                                ValidAccountOpening.handler(response, type);
                            } else if (type === 'sanity_check') {
                                ValidAccountOpening.handler(response);
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
    JapanAccOpening: JapanAccOpening,
};
