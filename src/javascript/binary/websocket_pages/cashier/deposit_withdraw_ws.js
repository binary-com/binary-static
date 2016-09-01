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
      document.getElementById('deposit-withdraw-heading').innerHTML = text.localize('Withdraw');
    } else if (/deposit/.test(window.location.hash)) {
      cashier_type = 'deposit';
      document.getElementById('deposit-withdraw-heading').innerHTML = text.localize('Deposit');
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
  function showError(error, id) {
    hideAll();
    $('#deposit-withdraw-error .error_messages').hide();
    if (id) {
      $('#deposit-withdraw-error #' + id).show();
    } else {
      $('#custom-error').html(error || text.localize('Sorry, an error occurred while processing your request.')).show();
    }
    $('#deposit-withdraw-error').show();
  }
  function showMessage(id) {
    $('#deposit-withdraw-message .messages').hide();
    $('#deposit-withdraw-message #' + id).show();
    $('#deposit-withdraw-message').show();
  }
  return {
    init: init,
    getCashierType: getCashierType,
    getCashierURL: getCashierURL,
    hideAll: hideAll,
    showError: showError,
    showMessage: showMessage
  };
})();

pjax_config_page_require_auth("cashier/forwardws", function() {
    return {
        onLoad: function() {
          function check_virtual() {
            if (page.client.is_virtual()) {
              ForwardWS.showError(text.localize('This feature is not relevant to virtual-money accounts.'));
            }
            return page.client.is_virtual();
          }
          if (!check_virtual()) {
            BinarySocket.init({
              onmessage: function(msg){
                var response = JSON.parse(msg.data);
                if (response && !check_virtual()) {
                  var type = response.msg_type;
                  var error = response.error;
                  if (type === 'cashier_password' && !error){
                    ForwardWS.init();
                    if (response.cashier_password === 1) {
                      ForwardWS.showMessage('cashier-locked-message');
                    } else {
                      var cashier_type = ForwardWS.getCashierType();
                      if (cashier_type === 'withdraw') {
                        BinarySocket.send({'verify_email': TUser.get().email, 'type': 'payment_withdraw'});
                        ForwardWS.showMessage('check-email-message');
                        $('#withdraw-form').show();
                      } else if (cashier_type === 'deposit') {
                        if (TUser.get().currency !== "") {
                          ForwardWS.getCashierURL();
                        } else {
                          ForwardWS.showMessage('choose-currency-message');
                          $('#currency-form').show();
                        }
                      }
                    }
                  } else if (type === 'cashier_password' && error) {
                    ForwardWS.showError(error.message);
                  } else if (type === 'cashier' && !error) {
                    ForwardWS.hideAll();
                    $('#deposit-withdraw-message').hide();
                    $('#deposit-withdraw-iframe-container iframe').attr('src', response.cashier);
                    $('#deposit-withdraw-iframe-container').show();
                  } else if (type === 'cashier' && error) {
                    ForwardWS.hideAll();
                    $('#deposit-withdraw-message').hide();
                    if (error.code && error.code === 'ASK_TNC_APPROVAL') {
                      window.location.href = page.url.url_for('user/tnc_approvalws');
                    } else if (error.code && error.code === 'ASK_FIX_DETAILS') {
                      var msgID = 'personal-details-message',
                          errorFields;
                      if(error.details) {
                        errorFields = {
                          province: 'State/Province',
                          country:  'Country',
                          city:     'Town/City',
                          street:   'First line of home address',
                          pcode:    'Postal Code / ZIP',
                          phone:    'Telephone',
                          email:    'Email address'
                        };
                      }
                      var errMsg = template($('#' + msgID).html(), [text.localize(error.details ? errorFields[error.details] : 'details')]);
                      $('#' + msgID).html(errMsg);
                      ForwardWS.showMessage(msgID);
                    } else if (error.code && error.code === 'ASK_UK_FUNDS_PROTECTION') {
                      $('#ukgc-funds-protection').show();
                    } else if (error.code && error.code === 'ASK_AUTHENTICATE') {
                      ForwardWS.showMessage('not-authenticated-message');
                    } else {
                        ForwardWS.showError(error.message);
                    }
                  } else if (type === 'set_account_currency' && !error) {
                    ForwardWS.getCashierURL();
                  } else if (type === 'set_account_currency' && error) {
                    ForwardWS.showError(error.message);
                  } else if (type === 'tnc_approval' && !error) {
                    ForwardWS.getCashierURL();
                  } else if (type === 'tnc_approval' && error) {
                    ForwardWS.showError(error.message);
                  }
                }
              }
            });
            if (!sessionStorage.getItem('client_status')) {
                BinarySocket.send({"get_account_status": "1", "passthrough":{"dispatch_to":"ForwardWS"}});
            }
            else if (
                (!page.client_status_detected('cashier_locked, unwelcome', 'any') && /deposit/.test(window.location.hash)) ||
                (!page.client_status_detected('cashier_locked, withdrawal_locked', 'any') && /withdraw/.test(window.location.hash))
            ) {
                BinarySocket.send({"cashier_password": "1"});
            }
          }
        }
    };
});
