const moment           = require('moment');
const elementInnerHtml = require('../common_functions/common_functions').elementInnerHtml;
const jpClient         = require('../common_functions/country_base').jpClient;
const BinarySocket     = require('../websocket_pages/socket');

const Clock = (() => {
    'use strict';

    let clock_started = false;
    let el_clock,
        client_time,
        get_time_interval,
        update_time_interval,
        view_popup_timer_func;

    const showLocalTimeOnHover = (selector) => {
        if (jpClient()) return;
        document.querySelectorAll(selector || '.date').forEach((el) => {
            const gmt_time_str = el.textContent.replace('\n', ' ');
            const local_time   = moment.utc(gmt_time_str, 'YYYY-MM-DD HH:mm:ss').local();
            if (local_time.isValid()) {
                el.setAttribute('data-balloon', local_time.format('YYYY-MM-DD HH:mm:ss Z'));
            }
        });
    };

    const toJapanTimeIfNeeded = (gmt_time_str, show_time_zone, longcode, hide_seconds) => {
        let match;
        if (longcode && longcode !== '') {
            match = longcode.match(/((?:\d{4}-\d{2}-\d{2})\s?(\d{2}:\d{2}:\d{2})?(?:\sGMT)?)/);
            if (!match) return longcode;
        }

        let time;
        if (typeof gmt_time_str === 'number') {
            time = moment.utc(gmt_time_str * 1000);
        } else if (gmt_time_str) {
            time = moment.utc(gmt_time_str, 'YYYY-MM-DD HH:mm:ss');
        } else if (match) {
            time = moment.utc(match[0], 'YYYY-MM-DD HH:mm:ss');
        }

        if (!time || !time.isValid()) {
            return null;
        }

        const jp_client = jpClient();
        const time_str = time.utcOffset(jp_client ? '+09:00' : '+00:00').format((hide_seconds ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD HH:mm:ss') + (show_time_zone && show_time_zone !== '' ? jp_client ? ' zZ' : ' Z' : ''));

        return (longcode ? longcode.replace(match[0], time_str) : time_str);
    };

    const getTime = () => {
        client_time = moment().valueOf();
        BinarySocket.send({ time: 1 }).then((response) => {
            if (!response.error) {
                timeCounter(response);
            }
        });
    };

    const startClock = () => {
        if (!clock_started) {
            getTime();
            clearInterval(get_time_interval);
            get_time_interval = setInterval(getTime, 30000);

            el_clock = document.getElementById('gmt-clock');
            clock_started = true;
        }
    };

    const timeCounter = (response) => {
        if (!clock_started || !el_clock) {
            startClock();
            return;
        }

        clearInterval(update_time_interval);

        const start_timestamp = response.time;
        const client_time_at_response = moment().valueOf();
        const server_time_at_response = ((start_timestamp * 1000) + (client_time_at_response - client_time));

        const updateTime = () => {
            window.time = moment((server_time_at_response + moment().valueOf()) - client_time_at_response).utc();
            const time_str = `${window.time.format('YYYY-MM-DD HH:mm:ss')} GMT`;
            if (jpClient()) {
                elementInnerHtml(el_clock, toJapanTimeIfNeeded(time_str, 1, '', 1));
            } else {
                elementInnerHtml(el_clock, time_str);
                showLocalTimeOnHover('#gmt-clock');
            }

            if (typeof view_popup_timer_func === 'function') {
                view_popup_timer_func();
            }
        };
        updateTime();
        update_time_interval = setInterval(updateTime, 1000);
    };

    return {
        startClock          : startClock,
        showLocalTimeOnHover: showLocalTimeOnHover,
        toJapanTimeIfNeeded : toJapanTimeIfNeeded,
        setViewPopupTimer   : (func) => { view_popup_timer_func = func; },
    };
})();

module.exports = Clock;
