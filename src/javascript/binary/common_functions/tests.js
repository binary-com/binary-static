import { expect } from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import websocket from 'ws'; // eslint-disable-line import/no-extraneous-dependencies
import { LiveApi } from 'binary-live-api'; // eslint-disable-line import/no-extraneous-dependencies

module.exports = {
    api: new LiveApi({ websocket, appId: 1 }),
    expect,
};
