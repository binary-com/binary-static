pjax_config_page("new_account/virtualws", function(){
  return {
    onLoad: function() {
      if (getCookieItem('login')) {
          window.location.href = page.url.url_for('user/my_accountws');
          return;
      }
      Content.populate();
      var virtualForm = $('#virtual-form');

      handle_residence_state_ws();
      BinarySocket.send({residence_list:1});
      var form = document.getElementById('virtual-form');
      var errorPassword = document.getElementById('error-password'),
          errorRPassword = document.getElementById('error-r-password'),
          errorResidence = document.getElementById('error-residence'),
          errorAccount = document.getElementById('error-account-opening'),
          errorVerificationCode = document.getElementById('error-verification-code');

      if (isIE() === false) {
        $('#password').on('input', function() {
          $('#password-meter').attr('value', testPassword($('#password').val())[0]);
        });
      } else {
        $('#password-meter').remove();
      }

      if (form) {
        virtualForm.submit( function(evt) {
          evt.preventDefault();

          var verificationCode = document.getElementById('verification-code').value,
              residence        = document.getElementById('residence').value,
              password         = document.getElementById('password').value,
              rPassword        = document.getElementById('r-password').value;

          Validate.errorMessageResidence(residence, errorResidence);
          Validate.errorMessageToken(verificationCode, errorVerificationCode);
          Validate.hideErrorMessage(errorAccount);

          if (Validate.errorMessagePassword(password, rPassword, errorPassword, errorRPassword) && !Validate.errorMessageResidence(residence, errorResidence) && !Validate.errorMessageToken(verificationCode, errorVerificationCode)){
            BinarySocket.init({
              onmessage: function(msg){
                var response = JSON.parse(msg.data);
                if (response) {
                  var type = response.msg_type;
                  var error = response.error;

                  if (type === 'new_account_virtual' && !error) {
                    page.client.set_cookie('residence', response.echo_req.residence);
                    page.client.process_new_account(
                      response.new_account_virtual.email,
                      response.new_account_virtual.client_id,
                      response.new_account_virtual.oauth_token,
                      true);
                  } else if (type === 'error' || error) {
                    if (error.code === 'InvalidToken' || error.code === 'duplicate email') {
                      virtualForm.empty();
                      $('.notice-message').remove();
                      var noticeText;
                      if (error.code === 'InvalidToken') {
                        noticeText = '<p>' + Content.localize().textClickHereToRestart.replace('[_1]', page.url.url_for('')) + '</p>';
                      } else if (error.code === 'duplicate email') {
                        noticeText = '<p>' + Content.localize().textDuplicatedEmail.replace('[_1]', page.url.url_for('user/lost_passwordws')) + '</p>';
                      }
                      virtualForm.html(noticeText);
                      return;
                    } else if (error.code === 'PasswordError') {
                      errorAccount.textContent = text.localize('Password is not strong enough.');
                    } else if (error.message) {
                      errorAccount.textContent = error.message;
                    }
                    Validate.displayErrorMessage(errorAccount);
                  }
                }
              }
            });
            VirtualAccOpeningData.getDetails(password, residence, verificationCode);
          }
        });
      }
    }
  };
});
