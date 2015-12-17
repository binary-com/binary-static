if(document.getElementById('btn-verify-email')) {

    document.getElementById('btn-verify-email').addEventListener('click', function(evt){
    	evt.preventDefault();
    	var email = document.getElementById('email').value;
    	var error = document.getElementsByClassName('error-message')[0];
        Content.populate();

    	if(!Validate.errorMessageEmail(email, error)) {
    		error.textContent = "";
    		error.setAttribute('style', 'display:none');

    		BinarySocket.init({
		        onmessage: function(msg){
		            var response = JSON.parse(msg.data);

		            if (response) {
		                var type = response.msg_type;
		                if (type === 'verify_email'){
		                    VerifyEmailWS.emailHandler(error);
		                }
		            }
		        }
		    });
		    VerifyEmailWS.init(email);
    	}
    });
}
        
