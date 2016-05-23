function submit_email() {
  var error = document.getElementById('signup_error');
  $('#verify-email-form').submit( function(evt){
    evt.preventDefault();
    var email = document.getElementById('email').value;
    Content.populate();

    if(!Validate.errorMessageEmail(email, error)) {
      BinarySocket.init({
          onmessage: function(msg){
              var response = JSON.parse(msg.data);

              if (response) {
                  var type = response.msg_type;
                  var wsError = response.error;
                  if (type === 'verify_email' && !wsError){
                    window.location.href = page.url.url_for('new_account/virtualws');
                  } else if (wsError && wsError.message) {
                    error.innerHTML = wsError.message;
                    error.style.display = 'inline-block';
                  }
              }
          }
      });
      BinarySocket.send({verify_email: email, type: 'account_opening'});
    }
  });
}
