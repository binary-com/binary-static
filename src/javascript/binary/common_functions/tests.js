const expect = require('chai').expect; // eslint-disable-line import/no-extraneous-dependencies
const websocket = require('ws'); // eslint-disable-line import/no-extraneous-dependencies
const { LiveApi } = require('binary-live-api'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = {
    api: new LiveApi({ websocket, appId: 1 }),
    expect,
};
