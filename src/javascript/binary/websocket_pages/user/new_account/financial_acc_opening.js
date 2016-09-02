pjax_config_page_require_auth("new_account/maltainvestws", function(){
  return {
    onLoad: function() {
      Content.populate();
      for (i = 0; i < page.user.loginid_array.length; i++){
        if (page.user.loginid_array[i].financial){
          window.location.href = page.url.url_for('user/my_accountws');
          return;
        } else if (page.user.loginid_array[i].non_financial){
          $('.security').hide();
        }
      }
      handle_residence_state_ws();
      BinarySocket.send({residence_list:1});
      BinarySocket.send({get_settings:1});
      $('#financial-form').submit(function(evt) {
        evt.preventDefault();
        if (FinancialAccOpeningUI.checkValidity()){
          BinarySocket.init({
            onmessage: function(msg){
              var response = JSON.parse(msg.data);
              if (response) {
                var error = response.error;
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
    }
  };
});
