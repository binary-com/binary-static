const expect            = require('chai').expect;
const moment            = require('moment');
const shouldForceReload = require('../check_new_release').shouldForceReload;

describe('checkNewRelease', () => {
    describe('.shouldForceReload()', () => {
        it('will not force reload if last reload is less than ten minutes ago', () => {
            expect(shouldForceReload(moment().valueOf() - (2 * 60 * 1000))).to.eq(false);
            expect(shouldForceReload(moment().valueOf() - (10 * 60 * 1000))).to.eq(false);
        });
        it('will force reload if last reload is more than ten minutes ago', () => {
            expect(shouldForceReload(moment().valueOf() - (11 * 60 * 1000))).to.eq(true);
            expect(shouldForceReload(moment().valueOf() - (60 * 60 * 1000))).to.eq(true);
        });
    });
});
