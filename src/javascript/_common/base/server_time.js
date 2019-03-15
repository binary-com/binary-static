const moment       = require('moment');
const BinarySocket = require('./socket_base');
const PromiseClass = require('../utility').PromiseClass;

const ServerTime = (() => {
    let clock_started = false;
    const pending = new PromiseClass();
    let server_time,
        perf_request_time,
        get_time_interval,
        update_time_interval,
        onTimeUpdated;

    const init = (fncTimeUpdated) => {
        if (!clock_started) {
            onTimeUpdated = fncTimeUpdated;
            requestTime();
            clearInterval(get_time_interval);
            get_time_interval = setInterval(requestTime, 30000);
            clock_started = true;
        }
    };

    const requestTime = () => {
        perf_request_time = performance.now();
        BinarySocket.send({ time: 1 }).then(timeCounter);
    };

    const timeCounter = (response) => {
        if (response.error) return;

        if (!clock_started) {
            init();
            return;
        }

        clearInterval(update_time_interval);

        const start_timestamp = response.time;
        const perf_response_time = performance.now();
        const server_time_at_response = ((start_timestamp * 1000) + (perf_response_time - perf_request_time));

        const updateTime = () => {
            server_time = moment(server_time_at_response + (performance.now() - perf_response_time)).utc();

            if (typeof onTimeUpdated === 'function') {
                onTimeUpdated();
            }
        };
        updateTime();
        pending.resolve();
        update_time_interval = setInterval(updateTime, 1000);
    };

    const get = () => server_time ? server_time.clone() : undefined;

    return {
        init,
        get,
        timePromise: pending.promise,
    };
})();

module.exports = ServerTime;
