function submit_email() {
    Content.populate();
    var form = $('#verify-email-form')[0];
    if (!form) {
        return;
    }

    bind_validation.simple(form, {
        schema: {
            email: [ValidateV2.required, ValidateV2.email]
        },
        stop: function(info) {
            $('#signup_error').text('');
            info.errors.forEach(function(err) {
                $('#signup_error')
                    .css({display: 'block'})
                    .text(err.err);
            });
        },
        submit: function(ev, info) {
            ev.preventDefault();
            if (info.errors.length) return;
            openAccount(info.values.email);
        },
    });

    function handler(msg) {
        var response = JSON.parse(msg.data);
        if (!response) return;

        var type  = response.msg_type;
        var error = response.error;
        if (type === 'verify_email' && !error) {
            window.location.href = page.url.url_for('new_account/virtualws');
            return;
        }
        if (!error || !error.message) return;
        $('#signup_error')
            .css({display: 'inline-block'})
            .text(error.message);
    }

    function openAccount(email) {
        BinarySocket.init({onmessage: handler});
        BinarySocket.send({verify_email: email, type: 'account_opening'});
    }
}
