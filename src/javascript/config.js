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
        var loginid = $.cookie('loginid'),
            isReal = loginid && !/^VRT/.test(loginid),
            toGreenPercent = {'real': 100, 'other': 0},
            randomPercent = Math.random() * 100,
            percentValues = $.cookie('connection_setup');
        if(percentValues && percentValues.indexOf(',') > 0) {
            var percents = percentValues.split(',');
            toGreenPercent.real  = +percents[0];
            toGreenPercent.other = +percents[1];
        }
        server_url = (/staging\.binary\.com/i.test(window.location.hostname) ? 'www2' :
                (isReal ? (randomPercent < toGreenPercent.real  ? 'green' : 'blue') :
                          (randomPercent < toGreenPercent.other ? 'green' : 'blue'))
            ) + '.binaryws.com';
    }
    return 'wss://' + server_url + '/websockets/v3';
}
