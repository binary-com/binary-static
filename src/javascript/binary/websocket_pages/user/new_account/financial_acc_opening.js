var handleResidence       = require('../../../common_functions/account_opening').handleResidence;
var Content               = require('../../../common_functions/content').Content;
var ValidAccountOpening   = require('../../../common_functions/valid_account_opening').ValidAccountOpening;
var FinancialAccOpeningUI = require('./financial_acc_opening/financial_acc_opening.ui').FinancialAccOpeningUI;

var FinancialAccOpening = (function() {
    var init = function() {
        Content.populate();
        for (i = 0; i < page.user.loginid_array.length; i++){
          if (page.user.loginid_array[i].financial){
            window.location.href = page.url.url_for('trading');
            return;
          } else if (page.user.loginid_array[i].non_financial){
            $('.security').hide();
          }
        }
        handleResidence();
        BinarySocket.send({residence_list:1});
        BinarySocket.send({get_financial_assessment:1});
        $('#financial-form').submit(function(evt) {
          evt.preventDefault();
          if (FinancialAccOpeningUI.checkValidity()){
            BinarySocket.init({
              onmessage: function(msg){
                var response = JSON.parse(msg.data);
                if (response) {
                  if (response.msg_type === 'new_account_maltainvest'){
                    ValidAccountOpening.handler(response, response.new_account_maltainvest);
                  }
                }
              }
            });
          }
        });
        $('#financial-risk').submit(function(evt) {
          evt.preventDefault();
          window.acceptRisk = true;
          if (FinancialAccOpeningUI.checkValidity()){
            BinarySocket.init({
              onmessage: function(msg){
                var response = JSON.parse(msg.data);
                if (response) {
                  if (response.msg_type === 'new_account_maltainvest'){
                    ValidAccountOpening.handler(response, response.new_account_maltainvest);
                  }
                }
              }
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
