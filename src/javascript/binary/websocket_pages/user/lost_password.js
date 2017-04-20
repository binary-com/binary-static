import BinaryPjax from '../../base/binary_pjax';
import { localize } from '../../base/localize';
import FormManager from '../../common_functions/form_manager';

const LostPassword = (() => {
    'use strict';

    const responseHandler = (response) => {
        if (response.verify_email) {
            BinaryPjax.load('user/reset_passwordws');
        } else if (response.error) {
            $('#form_error').removeClass('invisible').text(localize(response.error.message));
        }
    };

    const onLoad = () => {
        const form_id = '#frm_lost_password';
        FormManager.init(form_id, [
            {
                selector     : '#email',
                validations  : ['req', 'email'],
                request_field: 'verify_email',
            },
            { request_field: 'type', value: 'reset_password' },
        ]);
        FormManager.handleSubmit({
            form_selector       : form_id,
            fnc_response_handler: responseHandler,
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = LostPassword;
