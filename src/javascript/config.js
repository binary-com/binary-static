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
    if(!server_url) server_url = (/staging\.binary\.com/i.test(window.location.hostname) ? 'www2' : 'ws') + '.binaryws.com';
    return 'wss://' + server_url + '/websockets/v3';
}
