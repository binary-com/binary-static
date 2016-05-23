var ForwardWS = (function() {
  function init() {
    Content.populate();
    var verification_error = document.getElementById('verification-error');
    $('#submit-currency').click(function() {
      $('#submit-currency').attr('disabled', 'disabled');
      BinarySocket.send({"set_account_currency": $('#select-currency').val()});
    });
    $('#submit-verification').click(function() {
      var verification_token = document.getElementById('verification-token').value;
      if (!Validate.errorMessageToken(verification_token, verification_error)) {
        $('#submit-verification').attr('disabled', 'disabled');
        getCashierURL(verification_token);
      }
    });
    $('#submit-ukgc-funds-protection').click(function() {
      $('#submit-ukgc-funds-protection').attr('disabled', 'disabled');
      BinarySocket.send({"tnc_approval": 1, "ukgc_funds_protection": 1});
    });
  }
  function getCashierType() {
    var cashier_type;
    if (/withdraw/.test(window.location.hash)) {
      cashier_type = 'withdraw';
      document.getElementById('deposit-withdraw-heading').innerHTML = 'Withdraw';
    } else if (/deposit/.test(window.location.hash)) {
      cashier_type = 'deposit';
      document.getElementById('deposit-withdraw-heading').innerHTML = 'Deposit';
    }
    return cashier_type;
  }
  function getCashierURL(verification_token) {
    var req = {'cashier':getCashierType()};
    if (verification_token) req.verification_code = verification_token;
    BinarySocket.send(req);
  }
  function hideAll() {
    $('#withdraw-form').hide();
    $('#currency-form').hide();
    $('#ukgc-funds-protection').hide();
    $('#deposit-withdraw-error').hide();
  }
  function showError(error) {
    hideAll();
    document.getElementById('deposit-withdraw-error').innerHTML = error.message || text.localize('Sorry, an error occurred while processing your request.');
    $('#deposit-withdraw-error').show();
  }
  return {
    init: init,
    getCashierType: getCashierType,
    getCashierURL: getCashierURL,
    hideAll: hideAll,
    showError: showError
  };
})();

pjax_config_page_require_auth("cashier/forwardws", function() {
    return {
        onLoad: function() {
          function check_virtual() {
            if (page.client.is_virtual()) {
              var msg = document.getElementById('deposit-withdraw-message');
              msg.innerHTML = text.localize('This feature is not relevant to virtual-money accounts.');
              msg.classList.add('notice-msg', 'center');
            }
            return page.client.is_virtual();
          }
          if (!check_virtual()) {
            ForwardWS.init();
            BinarySocket.init({
              onmessage: function(msg){
                var response = JSON.parse(msg.data);
                if (response && !check_virtual()) {
                  var type = response.msg_type;
                  var error = response.error;
                  if (type === 'cashier_password' && !error){
                    if (response.cashier_password === 1) {
                      document.getElementById('deposit-withdraw-message').innerHTML = text.localize('Your cashier is locked as per your request - to unlock it, please click [_1]here')
                                                                                          .replace('[_1]', '<a href="' + page.url.url_for('user/settings/securityws') + '">') + '.</a>';
                    } else {
                      var cashier_type = ForwardWS.getCashierType();
                      if (cashier_type === 'withdraw') {
                        BinarySocket.send({'verify_email': page.user.email, 'type': 'payment_withdraw'});
                        document.getElementById('deposit-withdraw-message').innerHTML = text.localize('For added security, please check your email to retrieve the verification token.');
                        $('#withdraw-form').show();
                      } else if (cashier_type === 'deposit') {
                        if (TUser.get().currency !== "") {
                          ForwardWS.getCashierURL();
                        } else {
                          document.getElementById('deposit-withdraw-message').innerHTML = text.localize('Please choose which currency you would like to transact in.');
                          $('#currency-form').show();
                        }
                      }
                    }
                  } else if (type === 'cashier_password' && error) {
                    ForwardWS.showError(error);
                  } else if (type === 'cashier' && !error) {
                    ForwardWS.hideAll();
                    document.getElementById('deposit-withdraw-message').innerHTML = '';
                    $('#deposit-withdraw-iframe-container iframe').attr('src', response.cashier);
                    $('#deposit-withdraw-iframe-container').show();
                  } else if (type === 'cashier' && error) {
                    ForwardWS.hideAll();
                    document.getElementById('deposit-withdraw-message').innerHTML = '';
                    if (error.code && error.code === 'ASK_TNC_APPROVAL') {
                      window.location.href = page.url.url_for('user/tnc_approvalws');
                    } else if (error.code && error.code === 'ASK_FIX_ADDRESS') {
                      document.getElementById('deposit-withdraw-message').innerHTML = text.localize('There was a problem validating your personal details. Please fix the fields [_1]here')
                                                                                          .replace('[_1]', '<a href="' + page.url.url_for('user/settings/detailsws') + '">') + '.</a> ' +
                                                                                          text.localize('If you need assistance feel free to contact our [_1]Customer Support')
                                                                                          .replace('[_1]', '<a href="' + page.url.url_for('contact') + '">') + '.</a>';
                    } else if (error.code && error.code === 'ASK_UK_FUNDS_PROTECTION') {
                      $('#ukgc-funds-protection').show();
                    } else if (error.code && error.code === 'ASK_AUTHENTICATE') {
                      document.getElementById('deposit-withdraw-message').innerHTML = text.localize('Your account is not fully authenticated. Please visit the <a href="[_1]">authentication</a> page for more information.')
                                                                                          .replace('[_1]', page.url.url_for('cashier/authenticatews'));
                    } else {
                        ForwardWS.showError(error);
                    }
                  } else if (type === 'set_account_currency' && !error) {
                    ForwardWS.getCashierURL();
                  } else if (type === 'set_account_currency' && error) {
                    ForwardWS.showError(error);
                  } else if (type === 'tnc_approval' && !error) {
                    ForwardWS.getCashierURL();
                  } else if (type === 'tnc_approval' && error) {
                    ForwardWS.showError(error);
                  }
                }
              }
            });
            BinarySocket.send({"cashier_password": "1"});
          }
        }
    };
});
