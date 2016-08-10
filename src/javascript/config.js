/*
 * Configuration values needed in js codes
 *
 * NOTE:
 * Please use the following command to avoid accidentally committing personal changes
 * git update-index --assume-unchanged src/javascript/config.js
 *
 */

function getAppId() {
  return localStorage.getItem('config.app_id') ? localStorage.getItem('config.app_id') :
               /staging\.binary\.com/i.test(window.location.hostname) ? '1098' : '1';
}

function getSocketURL() {
    var server_url = localStorage.getItem('config.server_url');
    if(!server_url) {
        var loginid = Cookies.get('loginid'),
            isReal  = loginid && !/^VRT/.test(loginid),
            toGreenPercent = {'real': 100, 'virtual': 0, 'logged_out': 0}, // default percentage
            categoryMap    = ['real', 'virtual', 'logged_out'],
            randomPercent = Math.random() * 100,
            percentValues = Cookies.get('connection_setup'); // set by GTM

        // override defaults by cookie values
        if(percentValues && percentValues.indexOf(',') > 0) {
            var cookiePercents = percentValues.split(',');
            categoryMap.map(function(cat, idx) {
                if(cookiePercents[idx] && !isNaN(cookiePercents[idx])) {
                    toGreenPercent[cat] = +cookiePercents[idx].trim();
                }
            });
        }

        server_url = (/staging\.binary\.com/i.test(window.location.hostname) ? 'www2' :
                (isReal  ? (randomPercent < toGreenPercent.real       ? 'green' : 'blue') :
                 loginid ? (randomPercent < toGreenPercent.virtual    ? 'green' : 'blue') :
                           (randomPercent < toGreenPercent.logged_out ? 'green' : 'blue'))
            ) + '.binaryws.com';
    }
    return 'wss://' + server_url + '/websockets/v3';
}
