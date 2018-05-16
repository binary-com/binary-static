const moment       = require('moment');
const BinarySocket = require('./socket_base');

const ServerTime = (() => {
    let clock_started = false;
    let server_time,
        client_time,
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
        client_time = moment().valueOf();
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
        const client_time_at_response = moment().valueOf();
        const server_time_at_response = ((start_timestamp * 1000) + (client_time_at_response - client_time));

        const updateTime = () => {
            server_time = moment((server_time_at_response + moment().valueOf()) - client_time_at_response).utc();

            if (typeof onTimeUpdated === 'function') {
                onTimeUpdated();
            }
        };
        updateTime();
        update_time_interval = setInterval(updateTime, 1000);
    };

    const get = () => server_time ? server_time.clone() : undefined;

    return {
        init,
        get,
    };
})();

module.exports = ServerTime;
