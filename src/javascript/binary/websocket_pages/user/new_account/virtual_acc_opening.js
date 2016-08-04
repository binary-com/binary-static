pjax_config_page("new_account/virtualws", function() {

  // TODO: clean this up
  function handler(msg) {
    var response = JSON.parse(msg.data);
    if (!response) return;

    var errorAccount = $('#error-account-opening')[0];
    var type  = response.msg_type;
    var error = response.error;

    if (type === 'new_account_virtual' && !error) {
      var new_account = response.new_account_virtual;
      page.client.set_cookie('residence', response.echo_req.residence);
      page.client.process_new_account(
        new_account.email,
        new_account.client_id,
        new_account.oauth_token,
        true);
      return;
    }
    if (type !== 'error' && !error) return;
    if (error.code === 'InvalidToken' || error.code === 'duplicate email') {
      $form.empty();
      $('.notice-message').remove();
      var noticeText;
      if (error.code === 'InvalidToken') {
        noticeText = '<p>' + Content.localize().textClickHereToRestart.replace('[_1]', page.url.url_for('')) + '</p>';
      } else if (error.code === 'duplicate email') {
        noticeText = '<p>' + Content.localize().textDuplicatedEmail.replace('[_1]', page.url.url_for('user/lost_passwordws')) + '</p>';
      }
      $form.html(noticeText);
      return;
    } else if (error.code === 'PasswordError') {
      errorAccount.textContent = text.localize('Password is not strong enough.');
    } else if (error.message) {
      errorAccount.textContent = error.message;
    }
    Validate.displayErrorMessage(errorAccount);
  }

  function validate(data) {
    var V2 = ValidateV2;
    var err = Content.localize().textPasswordsNotMatching;
    function matches(value) {
      return value === data.password;
    }

    return validate_object(data, {
      residence: [V2.required],
      password:  [V2.password],
      'verification-code': [V2.required, V2.token],
      'r-password': [dv.check(matches, err)],
    });
  }

  function init() {
    Content.populate();
    handle_residence_state_ws();
    BinarySocket.send({residence_list: 1});

    var form = $('#virtual-form')[0];

    if (!isIE()) {
      $('#password').on('input', function() {
        $('#password-meter').attr('value', testPassword($('#password').val())[0]);
      });
    } else {
      $('#password-meter').remove();
    }

    if (!form) return;
    bind_validation.simple(form, {
      validate: validate,
      submit: function(e, validation) {
        e.preventDefault();
        if (validation.errors.length > 0) return;
        BinarySocket.init({onmessage: handler});
        var values = validation.values;
        VirtualAccOpeningData.getDetails({
          password:  values.password,
          residence: values.residence,
          verification_code: values['verification-code']
        });
      }
    });
  }

  return {
    onLoad: function() {
      if (getCookieItem('login')) {
          window.location.href = page.url.url_for('user/my_accountws');
          return;
      }
      init();
    }
  };
});
