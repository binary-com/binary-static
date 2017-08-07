const FormManager = require('../../common_functions/form_manager');

const TelegramBot = (() => {
    'use strict';

    const form = '#frm_telegram_bot';

    const onLoad = () => {
        const bot_name = 'binary_test_bot';

        FormManager.init(form, [
            { selector: '#token', validations: ['req'], exclude_request: 1 }
        ]);

        FormManager.handleSubmit({
            form_selector: form,
            fnc_response_handler: () => {
                const token = $('#token').val();
                const url = `https://t.me/${bot_name}/?start=${token}`;
                window.location.assign(url);
            }
        });
    };

    const onUnload = () => {
        $(form).off('submit');
    };

    return {
        onLoad: onLoad,
        onUnload: onUnload,
    };
})();

module.exports = TelegramBot;
