const handleResidence       = require('../../../common_functions/account_opening').handleResidence;
const populateObjects       = require('../../../common_functions/account_opening').populateObjects;
const Content               = require('../../../common_functions/content').Content;
const ValidAccountOpening   = require('../../../common_functions/valid_account_opening').ValidAccountOpening;
const Client                = require('../../../base/client').Client;
const url_for               = require('../../../base/url').url_for;
const FinancialAccOpeningUI = require('./financial_acc_opening/financial_acc_opening.ui').FinancialAccOpeningUI;

const FinancialAccOpening = (function() {
    let elementObj,
        errorObj,
        errorEl;

    const init = function() {
        Content.populate();
        Client.set('accept_risk', 0);
        const client_loginid_array = Client.get('loginid_array');
        for (let i = 0; i < client_loginid_array.length; i++) {
            if (client_loginid_array[i].financial) {
                window.location.href = url_for('trading');
                return;
            } else if (client_loginid_array[i].non_financial) {
                $('.security').hide();
            }
        }
        handleResidence();
        const object = populateObjects();
        elementObj = object.elementObj;
        errorObj = object.errorObj;
        errorEl = document.getElementsByClassName('notice-msg')[0];
        BinarySocket.send({ residence_list: 1 });
        BinarySocket.send({ get_financial_assessment: 1 });
        $('#financial-form').off('submit').on('submit', function(evt) { onSubmit(evt); });
        $('#financial-risk').off('submit').on('submit', function(evt) {
            Client.set('accept_risk', 1);
            onSubmit(evt);
        });
    };

    const onSubmit = (evt) => {
        evt.preventDefault();
        if (FinancialAccOpeningUI.checkValidity(elementObj, errorObj, errorEl)) {
            BinarySocket.init({
                onmessage: function(msg) {
                    const response = JSON.parse(msg.data);
                    if (response) {
                        const message_type = response.msg_type;
                        if (message_type === 'new_account_maltainvest') {
                            ValidAccountOpening.handler(response, message_type);
                        }
                    }
                },
            });
        }
    };

    return {
        init: init,
    };
})();

module.exports = {
    FinancialAccOpening: FinancialAccOpening,
};
