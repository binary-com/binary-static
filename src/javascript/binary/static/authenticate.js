pjax_config_page_require_auth("cashier/authenticatews", function(){
  return {
    onLoad: function() {
      Content.populate();
      function show_error(error) {
        message.innerHTML = '<div class="errorbox rbox" id="client_message" style="display:block">' +
                              '<div class="rbox-wrap">' +
                                '<div class="grd-grid-12 rbox-content" id="client_message_content">' +
                                  '<p class="center notice-msg">' +
                                    error +
                                  '</p>' +
                                '</div>' +
                              '</div>' +
                            '</div>';
      }
      function check_virtual() {
        if (page.client.is_virtual()) {
          show_error(text.localize('This feature is not relevant to virtual-money accounts.'));
        }
        return page.client.is_virtual();
      }
      var message = document.getElementById('authentication-message');
      if (!check_virtual()) {
        BinarySocket.init({
          onmessage: function(msg){
            var response = JSON.parse(msg.data);
            if (response) {
              var error = response.error;
              if (response.msg_type === 'get_account_status' && !check_virtual() && !error){
                if ($.inArray('authenticated', response.get_account_status.status) > -1) {
                  message.innerHTML = '<p>' +
                                        text.localize('Your account is fully authenticated. You can view your [_1]trading limits here').replace('[_1]', '<a class="pjaxload" href="' + page.url.url_for('cashier/limitsws') + '">') + '</a>.' +
                                      '</p>';
                } else {
                  message.innerHTML = '<p>' +
                                        text.localize('To authenticate your account, kindly email the following to [_1]').replace('[_1]', '<a href="mailto:support@binary.com">support@binary.com</a>') +
                                      '</p>' +
                                      '<p>' +
                                        text.localize('- A scanned copy of your passport, driving licence (provisional or full) or identity card, showing your name and date of birth.') +
                                      '</p>' +
                                      '<p>' +
                                        text.localize('and') +
                                      '</p>' +
                                      '<p>' +
                                        text.localize('- A scanned copy of a utility bill or bank statement (no more than 3 months old).') +
                                      '</p>';
                }
              } else if (error) {
                show_error(error.message);
              }
            }
          }
        });
        BinarySocket.send({'get_account_status': 1});
      }
    }
  };
});
