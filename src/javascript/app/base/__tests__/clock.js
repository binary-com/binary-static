const expect      = require('chai').expect;
const setJPClient = require('../../../_common/__tests__/tests_common').setJPClient;
const Clock       = require('../clock');

describe('Clock', () => {
    describe('.toJapanTimeIfNeeded()', () => {
        const toJapanTimeIfNeeded = Clock.toJapanTimeIfNeeded;

        const gmt_time_str = '2017-06-14 20:34:56';
        const jp_time_str  = '2017-06-15 05:34:56';

        describe('General', () => {
            it('returns null on empty input', () => {
                expect(toJapanTimeIfNeeded()).to.be.a('null');
            });
            it('returns null on invalid input', () => {
                expect(toJapanTimeIfNeeded('InvalidDateTime')).to.be.a('null');
            });
        });

        describe('Non-Japanese client', () => {
            it('returns the correct time', () => {
                expect(toJapanTimeIfNeeded(gmt_time_str)).to.be.a('string')
                    .and.to.be.eq(gmt_time_str);
            });
            it('returns the correct time having timezone', () => {
                expect(toJapanTimeIfNeeded(gmt_time_str, true)).to.be.a('string')
                    .and.to.be.eq(`${gmt_time_str} +00:00`);
            });
            it('returns the correct time without seconds', () => {
                expect(toJapanTimeIfNeeded(gmt_time_str, false, true)).to.be.a('string')
                    .and.to.be.eq(gmt_time_str.replace(/:\d{2}$/, ''));
            });
        });

        describe('Japanese client', () => {
            before(setJPClient);

            it('returns the correct time', () => {
                expect(toJapanTimeIfNeeded(gmt_time_str)).to.be.a('string')
                    .and.to.be.eq(jp_time_str);
            });
            it('returns the correct time having timezone', () => {
                expect(toJapanTimeIfNeeded(gmt_time_str, true)).to.be.a('string')
                    .and.to.be.eq(`${jp_time_str} UTC+09:00`);
            });
            it('returns the correct time without seconds', () => {
                expect(toJapanTimeIfNeeded(gmt_time_str, false, true)).to.be.a('string')
                    .and.to.be.eq(jp_time_str.replace(/:\d{2}$/, ''));
            });
        });
    });
});
