const moment       = require('moment');
const Dropdown     = require('@binary-com/binary-style').selectDropdown;
const BinarySocket = require('../../_common/base/socket_base');

const Contact = (() => {
    let $chat_button,
        $chat_unavailable,
        liveChatTimeout;

    const onLoad = () => {
        $chat_button      = $('#chat_button');
        $chat_unavailable = $('#live_chat_unavailable');
        showHideLiveChat();

        Dropdown('#cs_telephone_number');
        $('#cs_telephone_number').on('change.cs', function () {
            const val = $(this).val().split(',');
            $('#display_cs_telephone').html(val[0] + (val.length > 1 ? `<br />${val[1]}` : ''));
        });
    };

    // mon - fri 22 - 13 GMT
    // sat - sun 0 - 9 GMT
    const showHideLiveChat = () => {
        BinarySocket.wait('time').then((response) => {
            const moment_now        = moment.utc((response.time || 0) * 1000);
            const hour              = moment_now.hour();
            const day               = moment_now.day(); // 0-6 (0 for sunday and 6 for saturday)
            const is_weekday        = !/^(0|6)$/.test(day);
            const is_chat_available = is_weekday ? (hour >= 22 || hour < 13) : hour < 9;

            let next_interval,
                is_next_interval_tomorrow;
            if (is_chat_available) {
                $chat_button.attr({ href: 'https://binary.desk.com/customer/widget/chats/new', target: '_blank' }).removeClass('button-disabled');
                $chat_unavailable.setVisibility(0);

                next_interval = is_weekday ? 13 : 9;
                is_next_interval_tomorrow = false;
            } else {
                $chat_button.attr({ href: '', target: '' }).addClass('button-disabled');
                $chat_unavailable.setVisibility(1);

                next_interval = /^(0|1|2|3|4)$/.test(day) ? 22 : 0;
                is_next_interval_tomorrow = (is_weekday && hour >= 13) || (!is_weekday && hour >= 9);
            }

            const moment_interval = moment.utc().add(is_next_interval_tomorrow ? 1 : 0, 'day').hour(next_interval).minute(0);

            liveChatTimeout = setTimeout(showHideLiveChat, moment_interval.diff(moment_now, 'seconds') * 1000);
        });
    };

    const onUnload = () => {
        clearTimeout(liveChatTimeout);
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = Contact;
