import { expect }             from 'chai';
import { getOauthAppsObject } from '../process_data.js';
import BinarySocket           from '_common/base/socket_base';

describe('getOauthAppsObject', () => {
    it('Expects default oauth object when there are no arguments', () => {
        expect(getOauthAppsObject()).to.eql({ 2: 'Binary.com Autoexpiry' });
    });

    it('Expects correct value when arguments passed', () => {
        const response = new Promise(async (resolve, reject) => {
            await BinarySocket.send({ oauth_apps: 1 }).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
        response.then(result => {
            expect(Object.size(getOauthAppsObject(result))).to.be.above(1);
        });
    });
});