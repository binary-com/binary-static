const JapanAccOpeningUI   = require('./japan_acc_opening/japan_acc_opening.ui').JapanAccOpeningUI;
const BinaryPjax          = require('../../../base/binary_pjax');
const Client              = require('../../../base/client').Client;
const handleResidence     = require('../../../common_functions/account_opening').handleResidence;
const populateObjects     = require('../../../common_functions/account_opening').populateObjects;
const detect_hedging      = require('../../../common_functions/common_functions').detect_hedging;
const Content             = require('../../../common_functions/content').Content;
const ValidAccountOpening = require('../../../common_functions/valid_account_opening').ValidAccountOpening;

const JapanAccOpening = (function() {
    const onLoad = function() {
        Content.populate();
        ValidAccountOpening.redirectCookie();
        if (Client.get('residence') !== 'jp') {
            BinaryPjax.load('trading');
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
        onLoad: onLoad,
    };
})();

module.exports = JapanAccOpening;
