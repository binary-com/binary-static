const TelegramBot = (() => {
    'use strict';

    const form = '#frm_telegram_bot';

    const onLoad = () => {
        const bot_name = 'binary_test_bot';
        $(form).on('submit', (e) => {
            e.preventDefault();
            const token = $('#token').val();
            const url = `https://t.me/${bot_name}/?start=${token}`;
            window.location.assign(url);
        });
    };

    const onUnload = () => {
        $(form).off('submit');
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = TelegramBot;
