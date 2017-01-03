const moment          = require('moment');
const japanese_client = require('../common_functions/country_base').japanese_client;

const Clock = (function () {
    let clock_started = false;

    const showLocalTimeOnHover = function(s) {
        if (japanese_client()) return;
        $(s || '.date').each(function(idx, ele) {
            const gmtTimeStr = ele.textContent.replace('\n', ' ');
            const localTime  = moment.utc(gmtTimeStr, 'YYYY-MM-DD HH:mm:ss').local();
            if (!localTime.isValid()) {
                return;
            }

            const localTimeStr = localTime.format('YYYY-MM-DD HH:mm:ss Z');
            $(ele).attr('data-balloon', localTimeStr);
        });
    };

    const toJapanTimeIfNeeded = function(gmtTimeStr, showTimeZone, longcode, hideSeconds) {
        let match;
        if (longcode && longcode !== '') {
            match = longcode.match(/((?:\d{4}-\d{2}-\d{2})\s?(\d{2}:\d{2}:\d{2})?(?:\sGMT)?)/);
            if (!match) return longcode;
        }

        const jp_client = japanese_client();
        let time;

        if (typeof gmtTimeStr === 'number') {
            time = moment.utc(gmtTimeStr * 1000);
        } else if (gmtTimeStr) {
            time = moment.utc(gmtTimeStr, 'YYYY-MM-DD HH:mm:ss');
        } else {
            time = moment.utc(match[0], 'YYYY-MM-DD HH:mm:ss');
        }

        if (!time.isValid()) {
            return null;
        }

        const timeStr = time.utcOffset(jp_client ? '+09:00' : '+00:00').format((hideSeconds ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD HH:mm:ss') + (showTimeZone && showTimeZone !== '' ? jp_client ? ' zZ' : ' Z' : ''));

        return (longcode ? longcode.replace(match[0], timeStr) : timeStr);
    };

    const start_clock_ws = function() {
        const getTime = function() {
            clock_started = true;
            BinarySocket.send({ time: 1, passthrough: { client_time: moment().valueOf() } });
        };
        setInterval(getTime, 30000);
        getTime();
    };

    const time_counter = function(response) {
        if (isNaN(response.echo_req.passthrough.client_time) || response.error) {
            start_clock_ws();
            return;
        }
        clearTimeout(window.HeaderTimeUpdateTimeOutRef);
        const $clock = $('#gmt-clock'),
            start_timestamp = response.time,
            pass = response.echo_req.passthrough.client_time;

        const client_time_at_response = moment().valueOf(),
            server_time_at_response = ((start_timestamp * 1000) + (client_time_at_response - pass));
        const update_time = function() {
            window.time = moment((server_time_at_response + moment().valueOf()) -
                client_time_at_response).utc();
            const timeStr = window.time.format('YYYY-MM-DD HH:mm') + ' GMT';
            if (japanese_client()) {
                $clock.html(toJapanTimeIfNeeded(timeStr, 1, '', 1));
            } else {
                $clock.html(timeStr);
                showLocalTimeOnHover('#gmt-clock');
            }
            window.HeaderTimeUpdateTimeOutRef = setTimeout(update_time, 1000);
        };
        update_time();
    };

    return {
        start_clock_ws : start_clock_ws,
        time_counter   : time_counter,
        getClockStarted: function () { return clock_started; },

        showLocalTimeOnHover: showLocalTimeOnHover,
        toJapanTimeIfNeeded : toJapanTimeIfNeeded,
    };
})();

module.exports = {
    Clock: Clock,
};
