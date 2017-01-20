const handleResidence     = require('../../../common_functions/account_opening').handleResidence;
const populateObjects     = require('../../../common_functions/account_opening').populateObjects;
const Content             = require('../../../common_functions/content').Content;
const ValidAccountOpening = require('../../../common_functions/valid_account_opening').ValidAccountOpening;
const Client              = require('../../../base/client').Client;
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
        const object = populateObjects();
        const elementObj = object.elementObj;
        const errorObj = object.errorObj;
        $('#real-form').submit(function(evt) {
            evt.preventDefault();
            if (RealAccOpeningUI.checkValidity(elementObj, errorObj)) {
                BinarySocket.init({
                    onmessage: function(msg) {
                        const response = JSON.parse(msg.data);
                        if (response) {
                            const message_type = response.msg_type;
                            if (message_type === 'new_account_real') {
                                ValidAccountOpening.handler(response, message_type);
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
