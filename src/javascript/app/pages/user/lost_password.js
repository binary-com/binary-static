const FormManager = require('../../common/form_manager');
const localize    = require('../../../_common/localize').localize;

const LostPassword = (() => {
    const form_id = '#frm_lost_password';

    const responseHandler = (response) => {
        if (response.verify_email) {
            $('#password_reset_description').setVisibility(0);
            $(form_id).html($('<div/>', { class: 'notice-msg', text: localize('Please check your email for the password reset link.') }));
        } else if (response.error) {
            $('#form_error').setVisibility(1).text(localize(response.error.message));
        }
    };

    const onLoad = () => {
        FormManager.init(form_id, [
            { selector: '#email', validations: ['req', 'email'], request_field: 'verify_email' },
            { request_field: 'type', value: 'reset_password' },
        ]);
        FormManager.handleSubmit({
            form_selector       : form_id,
            fnc_response_handler: responseHandler,
        });
    };

    return {
        onLoad,
    };
})();

module.exports = LostPassword;
