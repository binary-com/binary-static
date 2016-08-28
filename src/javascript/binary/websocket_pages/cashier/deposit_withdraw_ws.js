var Validate = require('common_functions/validation');
var Content = require('trade/content');

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
  function lock_withdrawal(withdrawal_locked) {
    if (withdrawal_locked === 'locked') {
      showError('', 'withdrawal-locked-error');
    } else {
      BinarySocket.send({"cashier_password": "1"});
    }
  }
  return {
    init: init,
    getCashierType: getCashierType,
    getCashierURL: getCashierURL,
    hideAll: hideAll,
    showError: showError,
    showMessage: showMessage,
    lock_withdrawal: lock_withdrawal
  };
})();
