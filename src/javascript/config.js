// const Cookies = require('js-cookie');

/*
 * Configuration values needed in js codes
 *
 * NOTE:
 * Please use the following command to avoid accidentally committing personal changes
 * git update-index --assume-unchanged src/javascript/config.js
 *
 */

const getAppId = () => {
    let app_id = null;
    const user_app_id = ''; // you can insert Application ID of your registered application here
    const config_app_id = window.localStorage.getItem('config.app_id');
    if (config_app_id) {
        app_id = config_app_id;
    } else if (/staging\.binary\.com/i.test(window.location.hostname)) {
        window.localStorage.removeItem('config.default_app_id');
        app_id = 1098;
    } else if (user_app_id.length) {
        window.localStorage.setItem('config.default_app_id', user_app_id); // it's being used in endpoint chrome extension - please do not remove
        app_id = user_app_id;
    } else if (/localhost/i.test(window.location.hostname)) {
        app_id = 1159;
    } else {
        window.localStorage.removeItem('config.default_app_id');
        app_id = 1;
    }
    return app_id;
};

const getSocketURL = () => {
    let server_url = window.localStorage.getItem('config.server_url');
    if (!server_url) {
    // const toGreenPercent = { real: 100, virtual: 0, logged_out: 0 }; // default percentage
    // const categoryMap    = ['real', 'virtual', 'logged_out'];
    // const percentValues  = Cookies.get('connection_setup'); // set by GTM
    //
    // // override defaults by cookie values
    // if (percentValues && percentValues.indexOf(',') > 0) {
    //     const cookie_percents = percentValues.split(',');
    //     categoryMap.map((cat, idx) => {
    //         if (cookie_percents[idx] && !isNaN(cookie_percents[idx])) {
    //             toGreenPercent[cat] = +cookie_percents[idx].trim();
    //         }
    //     });
    // }

    // let server = 'blue';
    // if (!/staging\.binary\.com/i.test(window.location.hostname)) {
    //     const loginid = window.localStorage.getItem('active_loginid');
    //     let client_type = categoryMap[2];
    //     if (loginid) {
    //         client_type = /^VRT/.test(loginid) ? categoryMap[1] : categoryMap[0];
    //     }

    // const randomPercent = Math.random() * 100;
    // if (randomPercent < toGreenPercent[client_type]) {
    //     server = 'green';
    // }
    // }

    // server_url = `${server}.binaryws.com`;
        server_url = 'frontend.binaryws.com';
    }
    return `wss://${server_url}/websockets/v3`;
};

module.exports = {
    getAppId,
    getSocketURL,
};
