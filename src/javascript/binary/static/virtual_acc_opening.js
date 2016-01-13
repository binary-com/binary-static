pjax_config_page("virtualws", function(){
  return {
    onLoad: function() {
      if (getCookieItem('login')) {
          window.location.href = page.url.url_for('user/my_account');
          return;
      }
      get_residence_list();
      Content.populate();
      var form = document.getElementById('virtual-form');
      var errorEmail = document.getElementById('error-email'),
          errorPassword = document.getElementById('error-password'),
          errorRPassword = document.getElementById('error-r-password');

      $('#password').on('input', function() {
        $('#password-meter').attr('value', testPassword($('#password').val())[0]);
      });

      if (form) {
        $('#virtual-form').submit( function(evt) {
          evt.preventDefault();

          var email = document.getElementById('email').value,
              residence = document.getElementById('residence').value,
              password = document.getElementById('password').value,
              rPassword = document.getElementById('r-password').value;

          Validate.errorMessageEmail(email, errorEmail);

          if (Validate.errorMessagePassword(password, rPassword, errorPassword, errorRPassword) && !Validate.errorMessageEmail(email, errorEmail)){
            BinarySocket.init({
              onmessage: function(msg){
                var response = JSON.parse(msg.data);
                if (response) {
                  var type = response.msg_type;
                  var error = response.error;

                  if (type === 'new_account_virtual' && !error){
                    form.setAttribute('action', '/login');
                    form.setAttribute('method', 'POST');
                    $('#virtual-form').unbind('submit');
                    form.submit();
                  } else if (type === 'error' || error){
                    if (/email address is already in use/.test(error.message)) {
                      errorEmail.textContent = Content.localize().textDuplicatedEmail;
                    } else if (/email address is unverified/.test(error.message)) {
                      errorEmail.textContent = text.localize('Email address is unverified.');
                    } else if (/not strong enough/.test(error.message)) {
                      errorEmail.textContent = text.localize('Password is not strong enough.');
                    } else if (error.details && error.details.verification_code) {
                      if (/required/.test(error.details.verification_code)){
                        errorEmail.textContent = Content.localize().textTokenMissing;
                      }
                    } else {
                      errorEmail.textContent = Content.errorMessage('valid', Content.localize().textEmailAddress);
                    }
                    Validate.displayErrorMessage(errorEmail);
                  }
                }
              }
            });
            VirtualAccOpeningData.getDetails(email, password, residence);
          }
        });
      }
    }
  };
});
