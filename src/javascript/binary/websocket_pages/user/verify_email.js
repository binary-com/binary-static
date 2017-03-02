const BinaryPjax      = require('../../base/binary_pjax');
const localize        = require('../../base/localize').localize;
const url_for         = require('../../base/url').url_for;
const Content         = require('../../common_functions/content').Content;
const ValidateV2      = require('../../common_functions/validation_v2').ValidateV2;
const bind_validation = require('../../validator').bind_validation;

const VerifyEmail = function() {
    Content.populate();
    const clients_country = localStorage.getItem('clients_country');

    const form = $('#verify-email-form')[0];
    if (!form) {
        return;
    }

    const handler = function(msg) {
        const response = JSON.parse(msg.data);
        if (!response) return;

        const type = response.msg_type;
        const error = response.error;
        if (type === 'verify_email' && !error) {
            BinaryPjax.load('new_account/virtualws');
            return;
        }
        if (!error || !error.message) return;
        $('#signup_error')
            .css({ display: 'inline-block' })
            .text(error.message);
    };

    const openAccount = function(email) {
        BinarySocket.init({ onmessage: handler });
        BinarySocket.send({ verify_email: email, type: 'account_opening' });
    };

    bind_validation.simple(form, {
        schema: {
            email: [ValidateV2.required, ValidateV2.email],
        },
        stop: function(info) {
            $('#signup_error').text('');
            info.errors.forEach(function(err) {
                $('#signup_error')
                    .css({ display: 'block' })
                    .text(err.err);
            });
        },
        submit: function(ev, info) {
            ev.preventDefault();
            if (info.errors.length) return;
            if ((clients_country !== 'my') || /@binary\.com$/.test(info.values.email)) {
                openAccount(info.values.email);
            } else {
                $('#verify-email-form > div')
                    .html('<p class="notice-msg center-text">' +
                        localize('Sorry, account signup is not available in your country. Please contact <a href="[_1]">customer support</a> for more information.',
                            [url_for('contact')]) + '</p>');
            }
        },
    });
};

module.exports = {
    VerifyEmail: VerifyEmail,
};
