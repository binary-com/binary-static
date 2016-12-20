var handleResidence       = require('../../../common_functions/account_opening').handleResidence;
var Content               = require('../../../common_functions/content').Content;
var ValidAccountOpening   = require('../../../common_functions/valid_account_opening').ValidAccountOpening;
var Client                = require('../../../base/client').Client;
var url_for               = require('../../../base/url').url_for;
var FinancialAccOpeningUI = require('./financial_acc_opening/financial_acc_opening.ui').FinancialAccOpeningUI;

var FinancialAccOpening = (function() {
    var init = function() {
        Content.populate();
        var client_loginid_array = Client.loginid_array();
        for (var i = 0; i < client_loginid_array.length; i++) {
            if (client_loginid_array[i].financial) {
                window.location.href = url_for('trading');
                return;
            } else if (client_loginid_array[i].non_financial) {
                $('.security').hide();
            }
        }
        handleResidence();
        BinarySocket.send({ residence_list: 1 });
        BinarySocket.send({ get_financial_assessment: 1 });
        $('#financial-form').submit(function(evt) {
            evt.preventDefault();
            if (FinancialAccOpeningUI.checkValidity()) {
                BinarySocket.init({
                    onmessage: function(msg) {
                        var response = JSON.parse(msg.data);
                        if (response) {
                            if (response.msg_type === 'new_account_maltainvest') {
                                ValidAccountOpening.handler(response, response.new_account_maltainvest);
                            }
                        }
                    },
                });
            }
        });
        $('#financial-risk').submit(function(evt) {
            evt.preventDefault();
            window.acceptRisk = true;
            if (FinancialAccOpeningUI.checkValidity()) {
                BinarySocket.init({
                    onmessage: function(msg) {
                        var response = JSON.parse(msg.data);
                        if (response) {
                            if (response.msg_type === 'new_account_maltainvest') {
                                ValidAccountOpening.handler(response, response.new_account_maltainvest);
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
    FinancialAccOpening: FinancialAccOpening,
};
