if(document.getElementById('btn-verify-email')) {

    document.getElementById('btn-verify-email').addEventListener('click', function(evt){
      evt.preventDefault();
      var email = document.getElementById('email').value;
      var error = document.getElementById('signup_error');
      Content.populate();

      if(!Validate.errorMessageEmail(email, error)) {
        error.textContent = "";
        error.setAttribute('style', 'display:none');

        BinarySocket.init({
            onmessage: function(msg){
                var response = JSON.parse(msg.data);

                if (response) {
                    var type = response.msg_type;
                    var wsError = response.error;
                    if (type === 'verify_email' && !wsError){
                        VerifyEmailWS.emailHandler(error);
                    } else if (wsError && wsError.message) {
                      error.innerHTML = wsError.message;
                      error.setAttribute('style', 'display:block');
                    }
                }
            }
        });
        VerifyEmailWS.init(email);
      }
    });
}
