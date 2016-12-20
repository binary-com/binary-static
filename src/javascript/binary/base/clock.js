var moment          = require('moment');
var japanese_client = require('../common_functions/country_base').japanese_client;

var Clock = (function () {
    var clock_started = false;

    var start_clock_ws = function() {
        function getTime() {
            clock_started = true;
            BinarySocket.send({ time: 1, passthrough: { client_time: moment().valueOf() } });
        }
        var run = function() {
            setInterval(getTime, 30000);
        };
        run();
        getTime();
    };

    var time_counter = function(response) {
        if (isNaN(response.echo_req.passthrough.client_time) || response.error) {
            start_clock_ws();
            return;
        }
        clearTimeout(window.HeaderTimeUpdateTimeOutRef);
        var clock = $('#gmt-clock');
        var start_timestamp = response.time;
        var pass = response.echo_req.passthrough.client_time;

        var client_time_at_response = moment().valueOf();
        var server_time_at_response = ((start_timestamp * 1000) + (client_time_at_response - pass));
        var update_time = function() {
            window.time = moment((server_time_at_response + moment().valueOf()) -
                client_time_at_response).utc();
            var timeStr = window.time.format('YYYY-MM-DD HH:mm') + ' GMT';
            if (japanese_client()) {
                clock.html(toJapanTimeIfNeeded(timeStr, 1, '', 1));
            } else {
                clock.html(timeStr);
                showLocalTimeOnHover('#gmt-clock');
            }
            window.HeaderTimeUpdateTimeOutRef = setTimeout(update_time, 1000);
        };
        update_time();
    };

    var showLocalTimeOnHover = function(s) {
        if (japanese_client()) return;
        $(s || '.date').each(function(idx, ele) {
            var gmtTimeStr = ele.textContent.replace('\n', ' ');
            var localTime  = moment.utc(gmtTimeStr, 'YYYY-MM-DD HH:mm:ss').local();
            if (!localTime.isValid()) {
                return;
            }

            var localTimeStr = localTime.format('YYYY-MM-DD HH:mm:ss Z');
            $(ele).attr('data-balloon', localTimeStr);
        });
    };

    var toJapanTimeIfNeeded = function(gmtTimeStr, showTimeZone, longcode, hideSeconds) {
        var match;
        if (longcode && longcode !== '') {
            match = longcode.match(/((?:\d{4}-\d{2}-\d{2})\s?(\d{2}:\d{2}:\d{2})?(?:\sGMT)?)/);
            if (!match) return longcode;
        }

        var jp_client = japanese_client(),
            timeStr,
            time;

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

        timeStr = time.utcOffset(jp_client ? '+09:00' : '+00:00').format((hideSeconds ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD HH:mm:ss') + (showTimeZone && showTimeZone !== '' ? jp_client ? ' zZ' : ' Z' : ''));

        return (longcode ? longcode.replace(match[0], timeStr) : timeStr);
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
