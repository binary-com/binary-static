const Cookies = require('./lib/js-cookie');

/*
 * Configuration values needed in js codes
 *
 * NOTE:
 * Please use the following command to avoid accidentally committing personal changes
 * git update-index --assume-unchanged src/javascript/config.js
 *
 */

const getAppId = () => (
    window.localStorage.getItem('config.app_id') || (/staging\.binary\.com/i.test(window.location.hostname) ? '3475' : '1')
);

const getSocketURL = () => {
    let server_url = window.localStorage.getItem('config.server_url');
    if (!server_url) {
        const loginid = Cookies.get('loginid'),
            isReal  = loginid && !/^VRT/.test(loginid),
            toGreenPercent = { real: 100, virtual: 0, logged_out: 0 }, // default percentage
            categoryMap    = ['real', 'virtual', 'logged_out'],
            randomPercent = Math.random() * 100,
            percentValues = Cookies.get('connection_setup'); // set by GTM

        // override defaults by cookie values
        if (percentValues && percentValues.indexOf(',') > 0) {
            const cookie_percents = percentValues.split(',');
            categoryMap.map((cat, idx) => {
                if (cookie_percents[idx] && !isNaN(cookie_percents[idx])) {
                    toGreenPercent[cat] = +cookie_percents[idx].trim();
                }
            });
        }

        server_url = `${(/staging\.binary\.com/i.test(window.location.hostname) ? 'blue' :
                (isReal  ? (randomPercent < toGreenPercent.real       ? 'green' : 'blue') :
                 loginid ? (randomPercent < toGreenPercent.virtual    ? 'green' : 'blue') :
                           (randomPercent < toGreenPercent.logged_out ? 'green' : 'blue'))
            )}.binaryws.com`;
    }
    return `wss://${server_url}/websockets/v3`;
};

module.exports = {
    getAppId    : getAppId,
    getSocketURL: getSocketURL,
};
