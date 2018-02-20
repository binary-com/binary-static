const moment           = require('moment');
const BinarySocket     = require('./socket');
const jpClient         = require('../common/country_base').jpClient;
const elementInnerHtml = require('../../_common/common_functions').elementInnerHtml;
const getElementById   = require('../../_common/common_functions').getElementById;

const Clock = (() => {
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

    const toJapanTimeIfNeeded = (gmt_time_str, show_time_zone, hide_seconds) => {
        let time;

        if (typeof gmt_time_str === 'number') {
            time = moment.utc(gmt_time_str * 1000);
        } else if (gmt_time_str) {
            time = moment.utc(gmt_time_str, 'YYYY-MM-DD HH:mm:ss');
        }

        if (!time || !time.isValid()) {
            return null;
        }

        let offset    = '+00:00';
        let time_zone = 'Z';
        if (jpClient()) {
            offset    = '+09:00';
            time_zone = 'zZ';
        }

        return time.utcOffset(offset).format(`YYYY-MM-DD HH:mm${hide_seconds ? '' : ':ss'}${show_time_zone ? ` ${time_zone}` : ''}`);
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
            get_time_interval = setInterval(getTime, 15000);

            el_clock = getElementById('gmt-clock');
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
                elementInnerHtml(el_clock, toJapanTimeIfNeeded(time_str, 1, 1));
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
        startClock,
        showLocalTimeOnHover,
        toJapanTimeIfNeeded,

        setViewPopupTimer: (func) => { view_popup_timer_func = func; },
    };
})();

module.exports = Clock;
