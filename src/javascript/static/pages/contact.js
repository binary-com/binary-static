const moment           = require('moment');
const Dropdown         = require('@binary-com/binary-style').selectDropdown;
const setExternalTimer = require('../../app/base/clock').setExternalTimer;

const Contact = (() => {
    let $chat_button,
        $chat_unavailable;

    const onLoad = () => {
        $chat_button      = $('#chat_button');
        $chat_unavailable = $('#live_chat_unavailable');
        showHideLiveChat();
        setExternalTimer(showHideLiveChat);

        Dropdown('#cs_telephone_number');
        $('#cs_telephone_number').on('change.cs', function () {
            const val = $(this).val().split(',');
            $('#display_cs_telephone').html(val[0] + (val.length > 1 ? `<br />${val[1]}` : ''));
        });
    };

    const showHideLiveChat = () => {
        const moment_now        = moment.utc(Math.floor((window.time || 0)));
        const hour              = moment_now.hour();
        const is_weekday        = !/^(0|1)$/.test(moment_now.day());
        const is_chat_available = is_weekday ? (hour >= 22 || hour < 13) : hour < 9;
        if (is_chat_available) {
            $chat_button.attr({ href: 'https://binary.desk.com/customer/widget/chats/new', target: '_blank' }).removeClass('button-disabled');
        } else {
            $chat_button.attr({ href: '', target: '' }).addClass('button-disabled');
        }
        $chat_unavailable.setVisibility(!is_chat_available);
    };

    const onUnload = () => {
        setExternalTimer(null);
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = Contact;
