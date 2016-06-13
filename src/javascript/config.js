/*
 * Configuration values needed in js codes
 * 
 * NOTE:
 * Please use the following command to avoid accidentally committing personal changes
 * git update-index --assume-unchanged src/javascript/config.js
 *
 */

var app_id = /staging\.binary\.com/i.test(window.location.hostname) ? '1098' : '1';
var socket_url = 'wss://ws.binaryws.com/websockets/v3';
