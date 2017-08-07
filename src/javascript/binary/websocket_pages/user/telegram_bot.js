const TelegramBot = (() => {
    'use strict';

    const submit_button = $('#go_to_telegram');

    const onLoad = () => {
        const bot_name = 'binary_test_bot';
        submit_button.click((e) => {
            e.preventDefault();
            const token = $('#token').val();
            const url = `https://t.me/${bot_name}/?start=${token}`;
            window.location.assign(url);
        });
    };

    const onUnload = () => {
        submit_button.off('click');
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = TelegramBot;
