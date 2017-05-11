const moment       = require('moment');
const jpClient     = require('../common_functions/country_base').jpClient;
const BinarySocket = require('../websocket_pages/socket');

const Clock = (() => {
    'use strict';

    let clock_started = false,
        client_time,
        timeout;

    const showLocalTimeOnHover = (s) => {
        if (jpClient()) return;
        $(s || '.date').each((idx, ele) => {
            const gmt_time_str = ele.textContent.replace('\n', ' ');
            const local_time  = moment.utc(gmt_time_str, 'YYYY-MM-DD HH:mm:ss').local();
            if (local_time.isValid()) {
                $(ele).attr('data-balloon', local_time.format('YYYY-MM-DD HH:mm:ss Z'));
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
        } else {
            time = moment.utc(match[0], 'YYYY-MM-DD HH:mm:ss');
        }

        if (!time.isValid()) {
            return null;
        }

        const jp_client = jpClient();
        const time_str = time.utcOffset(jp_client ? '+09:00' : '+00:00').format((hide_seconds ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD HH:mm:ss') + (show_time_zone && show_time_zone !== '' ? jp_client ? ' zZ' : ' Z' : ''));

        return (longcode ? longcode.replace(match[0], time_str) : time_str);
    };

    const startClock = () => {
        if (!clock_started) {
            const getTime = () => {
                clock_started = true;
                client_time = moment().valueOf();
                BinarySocket.send({ time: 1 }).then((response) => { timeCounter(response); });
            };
            setInterval(getTime, 30000);
            getTime();
        }
    };

    const timeCounter = (response) => {
        if (isNaN(client_time) || response.error) {
            startClock();
            return;
        }
        clearTimeout(timeout);
        const $clock = $('#gmt-clock');
        const start_timestamp = response.time;

        const client_time_at_response = moment().valueOf();
        const server_time_at_response = ((start_timestamp * 1000) + (client_time_at_response - client_time));

        const updateTime = () => {
            window.time = moment((server_time_at_response + moment().valueOf()) - client_time_at_response).utc();
            const time_str = `${window.time.format('YYYY-MM-DD HH:mm')} GMT`;
            if (jpClient()) {
                $clock.html(toJapanTimeIfNeeded(time_str, 1, '', 1));
            } else {
                $clock.html(time_str);
                showLocalTimeOnHover('#gmt-clock');
            }
            timeout = setTimeout(updateTime, 1000);
        };
        updateTime();
    };

    return {
        startClock          : startClock,
        showLocalTimeOnHover: showLocalTimeOnHover,
        toJapanTimeIfNeeded : toJapanTimeIfNeeded,
    };
})();

module.exports = Clock;
